const express = require("express")
const session = require("express-session")
const app = express()

app.use(express.json())
app.use(session({
    secret : "0585d138dc7fbd1f"
}))

// app.use(session({
//     secure: ture,	// https 환경에서만 session 정보를 주고받도록처리
//     secret: process.env.COOKIE_SECRET, // 암호화하는 데 쓰일 키
//     resave: false, // 세션을 언제나 저장할지 설정함 -> request할 때마다 session을 다시 만들겠냐
//     saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정 -> 내가 세션 사용 안할거야 근데도 만들겠냐,,
//     cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
//       httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함 -> 웹해킹 막으려고 설정함 () / 무조건 http 통신 외에는 쿠키를 보내지 않겠다
//       Secure: true https 가 아니면 안보내겠다 / CSRF찾아보기!!(XSS)
//     }, 세션 - 쿠키
//     name: 'session-cookie' // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
//   }))

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

const categoryRouter = require("./src/router/categorys")
app.use("/categorys", categoryRouter)

app.listen(8000, () => {
    console.log("8000번 포트에서 실행")
})