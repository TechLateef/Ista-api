const { Model } = require('mongoose')

/**
 *
 * @param {Date} dateCreated : The date Post is created
 * @returns : String of duration in the form "x metric(s) ago"
 */

exports.getDuration = (dateCreated) => {
  const timeDiff = Date.now() - dateCreated
  const dateVars = {
    Year: parseInt(timeDiff / (1000 * 60 * 60 * 24 * 365)),
    Month: parseInt(timeDiff / (1000 * 60 * 60 * 24 * 30)),
    Week: parseInt(timeDiff / (1000 * 60 * 60 * 24 * 7)),
    Day: parseInt(timeDiff / (1000 * 60 * 60 * 24)),
    Hour: parseInt(timeDiff / (1000 * 60 * 60)),
    Minute: parseInt(timeDiff / (1000 * 60)),
    Seconds: parseInt(timeDiff / 1000),
  }

  for (const timeParam in dateVars) {
    const no = dateVars[timeParam]
    if (no >= 1) {
      return `${no} ${timeParam}${no > 1 ? 's' : ''} ago`
    }
  }
  return '0 seconds ago'
}
/**
 * Calculate and return the date of contract completion
 * @param {Date} moveInDate Listing Move In Date
 * @param {Number} rentalLength Rental lenght in Months
 * @returns {Date} The Date on which contract is complete
 */
exports.getEndDate = (moveInDate, rentalLength) => {
  return new Date(
    moveInDate.getDate() + rentalLength * 30 * 24 * 60 * 60 * 1000
  )
}

/**
 * Converts a number to rank format
 * @param {Number} rank The number
 */
exports.getRankedText = (rank) => {
  switch (rank) {
    case 1:
      return '1st'
    case 2:
      return '2nd'
    case 3:
      return '3rd'
    default:
      return `${rank}th`
  }
}

exports.validHavesOptions = [
  'electricityIncluded',
  'waterIncluded',
  'heatingIncluded',
  'gasIncluded',
  'additionalStorageSpaceIncluded',
  'additionalStorageSpaceAvailable',
  'airConditioningIncluded',
  'guestParkingIncluded',
  'coveredParkingAvailable',
  'guestParkingAvailable',
  'parkingAvailable',
  'inUnitLaundry',
  'inBuildingLaundry',
  'furnished',
  'petFriendly',
  'petFriendlyExceptions',
  'noPets',
  'smokingPermitted',
  'smokingPermittedExceptions',
  'smokingNotPermitted',
  'balcony',
  'backyard',
  'outdoorSpace',
  'sharedAmenities',
  'walkInCloset',
  'ensuiteBathroom',
  'openConceptKitchen',
  'walkable',
  'bikeFriendly',
  'wheelchairAccessible',
  'walkerAccessible',
  'recentlyRenovated',
]

/**
 *
 * @param {[String]} requirementsArray : Array of must-have or niceToHaves
 * @param {Object} listing : The listing to check agains the haves
 * @returns {[Boolean]}: Array of True or false corresponding to requirements matched
 */

exports.matchRequirements = (requirementsArray, listing) => {
  const matchedArray = []
  for (const requirement of requirementsArray) {
    switch (requirement) {
      case 'electricityIncluded':
      case 'waterIncluded':
      case 'heatingIncluded':
      case 'gasIncluded':
      case 'airConditioningIncluded':
        matchedArray.push(listing.utilitiesIncluded?.includes(requirement))
        break
      case 'guestParkingIncluded':
      case 'coveredParkingAvailable':
      case 'guestParkingAvailable':
        matchedArray.push(listing.parking?.includes(requirement))
        break
      case 'parkingAvailable':
        matchedArray.push(listing.parking?.length > 0)
        break
      case 'inUnitLaundry':
        matchedArray.push(listing?.laundry?.includes(requirement))
        break
      case 'inBuildingLaundry':
        matchedArray.push(listing?.laundry?.length > 0)
        break
      case 'furnished':
        matchedArray.push(listing.furnished === requirement)
        break
      case 'petFriendly':
        matchedArray.push(listing.petPolicy?.startsWith(requirement))
        break
      case 'noPets':
        matchedArray.push(listing.petPolicy === requirement)
        break
      case 'smokingPermitted':
        matchedArray.push(listing.smokingPolicy?.startsWith('permitted'))
        break
      case 'smokingNotPermitted':
        matchedArray.push(listing.smokingPolicy == 'notPermitted')
        break
      case 'balcony':
      case 'backyard':
        matchedArray.push(listing.outdoorSpace?.includes(requirement))
        break
      case 'outdoorSpace':
        matchedArray.push(listing.outdoorSpace?.length > 0)
        break
      case 'sharedAmenities':
        matchedArray.push(listing.sharedAmenities?.length > 0)
        break
      case 'dishwasher':
      case 'walkInCloset':
      case 'ensuiteBathroom':
      case 'openConceptKitchen':
        matchedArray.push(listing.inUnitAmenities?.includes(requirement))
        break
      case 'wheelchairAccessible':
      case 'walkerAccessible':
        matchedArray.push(listing.accessibility?.includes(requirement))
        break
      case 'recentlyRenovated':
        const diff = new Date().getFullYear() - listing.lastRenovated
        matchedArray.push(diff <= 5)
        break
      default:
        // Assume the criteria is matched
        //  Yet to handle bike-score and walk-score
        matchedArray.push(true)
    }
  }
  return matchedArray
}

/**
 * Generates a random password
 * @param {Number} length password length
 * @return {String} Generated password
 */
exports.getRandomPassword = (length = 8) => {
  var pass = ''
  const str =
    'abcdefghijklmn0A1B2C3D4E5F6G7H8I9J0KLMNopqrstu@v#w$x%_yzOPQRSTUVWXYZ+'
  const strlen = str.length
  let i, index

  for (i = 0; i < length; i++) {
    index = Math.floor(Math.random() * strlen)
    pass += str.charAt(index)
  }

  return pass
}

/**
 * Converts a number to currency format
 * @param {Number} number Number to convert
 * @return {String} number in the form CA$#,###.##
 */
exports.toCurrency = (number) => {
  return number.toLocaleString('us-US', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getMethods = (obj) => {
  let props = new Set()
  let currObj = obj
  do {
    Object.getOwnPropertyNames(currObj).map((item) => props.add(item))
  } while ((currObj = Object.getPrototypeOf(currObj)))
  return [...props.keys()].filter((item) => typeof obj[item] === 'function')
}
