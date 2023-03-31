const {StatusCodes} = require('http-status-codes');
const CustomApiError = require('./Custom.error');



class InternalServerError extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.InternalServerError;
    }
}

module.exports = InternalServerError