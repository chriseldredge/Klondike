var applicationException = function (message) {
    this.message = message;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this);
    } else {
        this.stack = new Error().stack;
    }
};

export default applicationException;
