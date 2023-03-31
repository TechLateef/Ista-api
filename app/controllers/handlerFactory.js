const QueryHandler = require('../utils/queryHandler')
const catchAsync = require('../utils/catchAsync')
const MyError = require('../utils/myError')
const { NotFound, BadRequest } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { body } = require('express-validator')
const { default: mongoose } = require('mongoose')

const confirmExistence = (doc, docName) => {
  if (!doc) {
    throw new NotFound(`No ${docName} found with that ID`)
  }
}

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params[Model.modelName.toLowerCase() + 'ID']
    const [valid, invalid] = exports.validateIds(id)
    if (!valid) {
      return next(new BadRequest(`${invalid} is an Invalid Id`))
    }
    const doc = await Model.findByIdAndDelete(id)
    confirmExistence(doc, Model.modelName)
    res.status(204).send()
  })

/**
 *
 * @param {Object} Model Model to update its doc
 * @param {[String]} forbiddenFields array of fields not allowed to be updated
 * @returns
 */
exports.updateOne = (Model, forbiddenFields = []) =>
  catchAsync(async (req, res, next) => {
    const id = req.params[Model.modelName.toLowerCase() + 'ID']
    const productName = req.params.pname
    const [valid, invalid] = exports.validateIds(id)
    if (!valid) {
      return next(new BadRequest(`${invalid} is an Invalid Id`))
    }
    forbiddenFields.forEach((field) => {
      if (req.body[field]) delete req.body[field]
    })
    const doc = await Model.findOneAndUpdate({_id:id, 'products.name':productName},req.body, {
      new: true,
      runValidators: true,
    })
    confirmExistence(doc, Model.modelName)
    res.status(StatusCodes.OK).json({ status: 'success', data: doc })
  })

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params[Model.modelName.toLowerCase() + 'ID']
    const [valid, invalid] = exports.validateIds(id)
    if (!valid) {
      return next(new BadRequest(`${invalid} is an Invalid Id`))
    }
    let query = Model.findById(id)
    if (populateOptions) {
      populateOptions.forEach((option) => {
        query = query.populate(...option)
      })
    }
    const doc = await query
    confirmExistence(doc, Model.modelName)
    res.status(200).json({ status: 'succcess', data: doc })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.filter ? req.filter : {}
    const Processor = new QueryHandler(Model, { ...req.query, ...filter })
    const results = await Processor.process()
    res
      .status(200)
      .json({ status: 'success', result: results.length, data: results })
  })

exports.createOne = (Model, callback = false) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body)
    callback && (await callback(newDoc, req.user))
    res.status(201).json({ status: 'success', data: newDoc })
  })

/**
 *
 * @param {Model} Model the Model / Table
 * @param {[String]} prohibited List of fields not allowed to be edited by user
 * @returns {Function}
 */
exports.updateMe = (Model, prohibited = []) =>
  catchAsync(async (req, res, next) => {
    const data = req.body

    if (data.hasOwnProperty('password') || data.hasOwnProperty('_kind'))
      return next(new BadRequest('Unauthorized field included!'))

    // Remove prohibited Fields
    prohibited.forEach((field) => {
      if (data.hasOwnProperty(field)) delete data[field]
    })
    const updated = await Model.findByIdAndUpdate(req.user._id, data, {
      new: true,
    })
    res.status(StatusCodes.OK).json({ status: 'success', data: updated })
  })

/**
 *
 * @param {Object} Model
 * @param {[String]} keys array of keys to compare against user ID
 * @param {(doc) => [Boolean, String]} addedCheckFxn A function to check against the document
 * returns an array with first element as true and second as message
 * @returns
 */
exports.allowEdits = (Model, keys, addedCheckFxn = (doc) => [true, '']) =>
  catchAsync(async (req, res, next) => {
    const id = req.params[Model.modelName.toLowerCase() + 'ID']
    const [valid, invalid] = exports.validateIds(id)
    if (!valid) {
      return next(new BadRequest(`${invalid} is an Invalid Id`))
    }
    const doc = await Model.findById(id)
    if (!doc) return next(new NotFound(`No document with id: ${id}`))
    const checkValue = addedCheckFxn(doc)
    if (!checkValue[0]) return next(new BadRequest(checkValue[1]))
    req.targetDoc = doc
    for (const key of keys) {
      const id = doc[key]?._id || doc[key]
      if (id.toString() === req.user?._id.toString()) {
        return next()
      }
    }
    throw new MyError(
      `You can only ${req.method.toLowerCase()} ${Model.modelName.toLowerCase()} you created`,
      403
    )
  })

exports.validateEmailsField = [
  body('emails', 'emails field is required').exists().not().isEmpty(),
  body('emails.*', 'emails contain Invalid Email Addres').isString().isEmail(),
]

/**
 * Validate if a field is a valid Mongoose ID
 * @param {[String]} keyValues An array of potential mongoose Ids
 * @return {[Boolean, String]} an Array with first value of validity status and second value that fails
 */

exports.validateIds = (...keyValues) => {
  for (const val of keyValues)
    if (!mongoose.Types.ObjectId.isValid(val)) return [false, val]
  return [true, null]
}
