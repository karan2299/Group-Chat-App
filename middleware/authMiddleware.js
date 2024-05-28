
const User = require('../models/User');
const jwToken = require('../services/jwtToken');


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization
    const tokenData = await jwToken.decode(token);
    console.log("tokenData",tokenData)
        jwToken.verify(tokenData,async (err, decoded) => {
            if (err) {
                res.status(401).send({ error: 'authentication Error....' });
            }
            const user = await User.findById(decoded.id);
            if (!user) {
                throw new Error();
            }
            req.user = user;
            next();
        });


}
module.exports = authMiddleware;
