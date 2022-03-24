require("dotenv").config();
const express = require("express");
const route = require("./route");

const app = express();

const db = require("./db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", route.adminRouter);
app.use("/manager", route.managerRouter);
app.use("/user", route.userRouter);

app.listen(process.env.PORT || 3003,()=>{
    console.log("server running...");
});
