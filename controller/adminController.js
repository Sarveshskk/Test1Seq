const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Address = require("../models/address");
const Task = require("../models/task");


exports.addUser = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = await User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
                role: req.body.role,
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
            if (foundUser.role == "admin") {
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
                res.status(403).json("its admin login page. you are not admin.");
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
            res.status(401).json("user address not updated! check for user id");
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
};

exports.updateRole = async (req, res) => {
    try {
        let role = req.body.role
        let user_id = req.params["id"];
        let updatedData = await User.update({ role: role }, {
            where: {
                id: user_id,
            }
        });
        if (!updatedData) {
            res.status(401).json("error occured while updating role");
        }
        res.status(200).json("user role updated");
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

exports.userToManager = async (req, res) => {
    try {
        let manager_id = req.body.manager_id;
        let user_id = req.body.user_id;
        let foundUser = await User.findOne({
            where: {
                id: user_id,
            }
        });
        if (foundUser) {
            if (foundUser.role == 'user') {
                let foundManager = await User.findOne({
                    where: {
                        id: manager_id,
                    }
                });
                if (foundManager) {
                    if (foundManager.role == 'manager') {
                        let managerData = await User.update({ manager_id: manager_id }, {
                            where: {
                                id: user_id,
                            }
                        });
                        if (!managerData) {
                            res.status(403).json("user  not assign to manager! check for user id");
                        }
                        res.status(200).json("user assigned to manager");
                    } else {
                        res.status(403).json("user role is different from manager");
                    }
                } else {
                    res.status(403).json("manager not found");
                }
            } else {
                res.status(403).json("user role is different from user");
            }

        } else {
            res.status(401).json("unauthorised user");
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

exports.changePassword = async (req, res) => {
    try {
        let user_id = req.params['id'];
        if (req.body.password == req.body.cnfpassword) {
            let password = md5(req.body.password);
            let updatedpassword = await User.update({ password: password }, {
                where: {
                    id: user_id,
                }
            });
            if (updatedpassword) {
                res.status(200).json("update password successfull")
            } else {
                res.status(400).json("user id incorrect.")
            }
        } else {
            res.status(400).json("please type password carefully")
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

exports.readTasks = async (req, res) => {
    try {
        let user_id = req.params["id"];
        let userData = await User.findAll({
            include: {
                model: Task,
                attributes: ["task_name", "description", "task_status"]
            },
            where: {
                id: user_id
            }
        });
        res.json(userData)
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

exports.deleteUser = async (req, res) => {
    try {
        let user_id = req.params['id'];
        let deletedUser = await User.destroy({
            where: {
                id: user_id
            }
        });
        if (!deletedUser) {
            res.status(404).json("user not deleted! check for user id.");
        }
        res.status(200).json("user deleted successfully");
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};



