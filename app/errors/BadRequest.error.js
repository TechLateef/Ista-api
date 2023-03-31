const CustomApiError = require("./Custom.error");
const statusCodes = require('http-status-codes')
class BadRequest extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCodes = statusCodes.StatusCodes.BAD_REQUEST

    }
}

module.exports = BadRequest