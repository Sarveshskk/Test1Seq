const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Address = require("../models/address");
const Task = require("../models/task");

exports.signUp = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = await User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            });
            let userData = await User.findOne({
                where: {
                    username: req.body.username,
                }
            });
            const token = jwt.sign(
                { id: userData.id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 60000,
                }
            );
            res.status(200).json({ jwttoken: token });
        } else {
            res.status(400).json("password and confirm password must be match");
        }
    }
    catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.login = async (req, res) => {
    try {

        let username = req.body.username
        let password = md5(req.body.password)
        let foundUser = await User.findOne({
            where: {
                username: username,
            }
        });
        if (foundUser) {
            if (foundUser.role == "user") {
                if (foundUser.password === password) {
                    const token = jwt.sign(
                        { id: foundUser.id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).json({ jwttoken: token });
                } else {
                    res.status(403).json("Unauthorised person! incorrect password");
                }
            } else {
                res.status(403).json("its user login page. you are not user.");
            }
        } else {
            res.status(401).json("User not regestered.");
        }
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.address = async (req, res) => {
    try {
        let user = req.user;
        const address = await Address.create({
            user_id: user["id"],
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no
        })
        if (!address) {
            res.status(400).json("user address not updated! check for user id");
        }
        res.status(200).json("user address updated");
    }
    catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message)
    });
}

exports.assignedTask = async (req, res) => {
    try {
        let user = req.user;
        let userData = await User.findAll({
            include: {
                model: Task,
                attributes: ["task_name", "description", "task_status"]
            },
            where: {
                id: user["id"]
            }
        });
        res.status(200).json(userData)
    }
    catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.updateTaskStatus = async (req, res) => {
    try {
        let task_status = req.body.task_status
        let task_id = req.params["id"];
        let updatedData = await Task.update({ task_status: task_status }, {
            where: {
                task_id: task_id,
            }
        });
        if (!updatedData) {
            res.status(400).json("error occured while updating task status!please check task id");
        }
        res.status(200).json("user task status updated");
    }
    catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};



