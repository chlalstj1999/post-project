const customError = (statusCode, message) => {
    const error = new Error(message)
    error.statuscode = statusCode
    return error
}

module.exports = customError