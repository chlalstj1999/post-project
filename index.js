const express = require("express")
const app = express()

app.use(express.json())

const loginRouter = require("./src/router/login")
app.use("/login", loginRouter)

const logoutRouter = require("./src/router/logout")
app.use("/logout", logoutRouter)

const userRouter = require("./src/router/users")
app.use("/users", userRouter)

const findRouter = require("./src/router/find")
app.use("/find", findRouter)

const postRouter = require("./src/router/posts")
app.use("/posts", postRouter)

app.listen(8000, () => {
    
})