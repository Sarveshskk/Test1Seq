const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");
const Address = require("../models/address");
const userTask = require("../models/userTaskJunction");
const TaskPerformance = require("../models/performanceRating");


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
            if (foundUser.role == "manager") {
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
                res.status(403).json("its manager login page. you are not manager.");
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
        });
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

exports.createTask = async (req, res) => {
    try {
        let user = req.user;
        const task = await Task.create({
            manager_id: user["id"],
            task_name: req.body.task_name,
            description: req.body.description,
        });
        if (!task) {
            res.json("task not created! check for user id");
        }
        res.status(200).json("task created");
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

exports.deleteTask = async (req, res) => {
    try {
        let user = req.user;
        let task_id = req.params['id'];

        let foundTask = await Task.findOne({
            where: {
                task_id: task_id,
            }
        });
        if (foundTask.manager_id != user["id"]) {
            res.status(401).json("unauthorised!you are not a manager of this task.please type own created task id");
        } else {
            let deletedTask = await Task.destroy({
                where: {
                    manager_id: user["id"],
                    task_id: task_id,
                }
            });
            if (!deletedTask) {
                res.status(400).json("task not deleted!please check task id");
            }
            res.status(200).json("task deleted successfully");
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

exports.updateTask = async (req, res) => {
    try {
        let user = req.user;
        let task = req.body.task_name;
        let task_id = req.params["id"];
        let isUser = await Task.findOne({
            where: {
                manager_id: user["id"],
                task_id: task_id,
            }
        });
        if (isUser) {
            let updatedData = await Task.update({ task_name: task }, {
                where: {
                    task_id: task_id,
                }
            });
            if (!updatedData) {
                res.status(400).json("error occured while updating task!please check task id");
            }
            res.status(200).json("user task updated");
        } else {
            res.status(403).json("task belong to other manager");
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

exports.assignedUsers = async (req, res) => {
    try {
        let user = req.user;

        let userData = await User.findOne({
            where: {
                id: user["id"],
            },
            include: [{
                model: User,
                as: "myusers",
                attributes: ["first_name", "username", "email"]
            }]
        });
        if (!userData) {
            res.status(403).json("some error occured");
        }
        res.status(200).json(userData);
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
        let user = req.user;
        let task_status = req.body.task_status
        let task_id = req.params["id"];
        let isUser = await Task.findOne({
            where: {
                manager_id: user["id"],
                task_id: task_id,
            }
        });
        if (isUser) {
            let updatedData = await Task.update({ task_status: task_status }, {
                where: {
                    task_id: task_id,
                }
            });
            if (!updatedData) {
                res.status(400).json("error occured while updating task status!please check task id");
            }
            res.status(200).json("user task status updated");
        } else {
            res.status(403).json("task belong to other manager");
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

exports.assignTaskToUser = async (req, res) => {
    try {
        let manager = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;
        let isTask = await Task.findOne({
            where: {
                manager_id: manager["id"],
                task_id: task_id,
            }
        });
        if (!isTask) {
            res.status(401).json("task belong to other manager.");
        } else {
            let isUser = await User.findOne({
                where: {
                    id: user_id,
                    manager_id: manager["id"],
                }
            });
            if (!isUser) {
                res.status(401).json("user belong to other manager.");
            } else {
                let assignTask = await userTask.create({
                    user_id: user_id,
                    task_id: task_id,
                });
                if (!assignTask) {
                    res.status(400).json("error occured while assign task!please check task id and user id");
                }
                res.status(200).json("task assigned");
            }
        }
    }
    catch (error) {
        res.status(400).json(error)
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.unAssignedTask = async (req, res) => {
    try {
        let manager = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;

        let isTask = await Task.findOne({
            where: {
                manager_id: manager["id"],
                task_id: task_id,
            }
        });
        if (!isTask) {
            res.status(401).json("task belong to other manager.");
        } else {
            let isUser = await User.findOne({
                where: {
                    id: user_id,
                    manager_id: manager["id"],

                }
            });
            if (!isUser) {
                res.status(401).json("user belong to other manager.");
            } else {
                let unAssignTask = await userTask.destroy({
                    where: {
                        user_id: user_id,
                        task_id: task_id,
                    }
                });
                if (!unAssignTask) {
                    res.status(400).json("error occured while unassign task!please check task id and user id");
                }
                res.status(200).json("user task unassigned");
            }
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
}

exports.assignMultiUserOnTask = async (req, res) => {
    try {
        let task_id = req.params["id"];
        let manager = req.user;
        let isTask = await Task.findOne({
            where: {
                manager_id: manager["id"],
                task_id: task_id,
            }
        });
        if (!isTask) {
            res.status(401).json("task belong to other manager.");
        } else {
            let user = await User.findAll({
                where: {
                    manager_id: manager["id"],
                }
            });
            user.map(async (item) => {
                await userTask.create({
                    user_id: item.id,
                    task_id: task_id,
                });
            });
            res.status(200).json("multiple user assigned on task");
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

exports.rateUser = async (req, res) => {
    try {
        let manager = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;
        let task_rating = req.body.task_rating;
        let isTask = await Task.findOne({
            where: {
                manager_id: manager["id"],
                task_id: task_id,
            }
        });
        if (!isTask) {
            res.status(401).json("task belong to other manager.");
        } else {
            let isUser = await User.findOne({
                where: {
                    id: user_id,
                    manager_id: manager["id"],

                }
            });
            if (!isUser) {
                res.status(401).json("user belong to other manager.");
            } else {
                let userRating = await TaskPerformance.create({
                    user_id: user_id,
                    task_id: task_id,
                    task_rating:task_rating,
                });
                if (!userRating) {
                    res.status(400).json("error occured while creating task rating!please check task id and user id");
                }
                res.status(200).json("task rating created");
            }
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

