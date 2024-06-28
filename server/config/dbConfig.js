require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Db connected sucessfully"))
    .catch((e) => console.log(e));
};


module.exports = dbConnect