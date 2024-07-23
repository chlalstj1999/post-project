const customError = require("../router/data/error")

const isRegxMatch = params => {
    return (req, res, next) => {
        try {
            params.forEach(([paramName, paramRegx]) => {
                const value = req.body[paramName]

                if (!value.match(paramRegx)) {
                    throw customError(400, `${paramName}의 입력을 확인해야 함`)
                }
            })

            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = isRegxMatch