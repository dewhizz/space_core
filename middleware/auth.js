const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    // extract authorization header
    const authHeader = req.headers.authorization
    // get the actual token from the header
    const token = authHeader && authHeader.split(' ')[1]

    // check if we have a token
    if (!token) return res.status(400).json({ message: 'No token provided' })
    try {
        //    verify the token using the secret key 
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        return res.status(403)({ message: "Insufficient authorization" })

        // we attach the payload to the request object
        // this is the logged in user
        req.user = decode
        // proceed to the next route/function
        next()

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = auth