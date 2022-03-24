const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();

const verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.replace(/^Bearer\s+/, "");
        if (token == null) return res.Status(401)
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        let userData = await User.findOne({
            where: {
                id: user['id'],
                role: "admin",
            }
        });
        if (!userData) {
            res.status(403).json({
                message: "unauthorised user!"
            });
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        res.json(err)
    }
};
module.exports = verifyAdmin;