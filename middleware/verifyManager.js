const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();

const verifyManager = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.replace(/^Bearer\s+/, "");
        if (token == null) return res.sendStatus(401)
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        let userData = await User.findOne({
            where: {
                id: user['id'],
                role: "manager",
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
        res.status(400).json(err)
    }
};
module.exports = verifyManager;
