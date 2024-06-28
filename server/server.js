require('dotenv').config()
const express = require("express");
const dbConnect = require("./config/dbConfig");
const cors =  require('cors')
const errorHandler = require('./middleware/errorHandler')
const authRoutes = require('./routes/auth')
const classRoutes = require('./routes/class')
const studentRoutes = require('./routes/student')
const teacherRoutes = require('./routes/teacher')


const app = express();
const port = process.env.PORT || 4000;
app.use(express.json())
app.use(cors())

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/class",classRoutes)
app.use("/api/v1/student",studentRoutes)
app.use("/api/v1/teacher",teacherRoutes)

// health check
app.use('/health',(req,res)=>{
    res.send("route is healthy")
})

// handle invalid routes
app.use('*',(req,res,next)=>{
    const url = req.originalUrl
    res.json({
        message:`${url} is not a valid endpoint`,
    })
})


app.use(errorHandler)

dbConnect()
app.listen(port, () => {
  console.log(`server connected successfully at http://localhost:${port}`);
});
