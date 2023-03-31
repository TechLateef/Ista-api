const {StatusCodes} = require('http-status-codes');
const CustomApiError = require('./Custom.error');




class UnAuthenticate extends CustomApiError{
    constructor(message){
        super(message);
        this.statuscode = StatusCodes.UNAUTHORIZED
    }
}
module.exports = UnAuthenticate