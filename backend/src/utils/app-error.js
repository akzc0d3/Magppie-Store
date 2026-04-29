export default class AppError extends Error {

    constructor({ message, statusCode, data = null }) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        this.success = false;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }

}

 