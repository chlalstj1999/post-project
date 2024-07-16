const express = require("express")
const session = require("express-session")
const customError = require("./src/router/data/error")
const app = express()

app.use(express.json())
app.use(session({
    secret : "0585d138dc7fbd1f",
    resave : false,
    saveUninitialized : true
}))

// app.use(session({
//     secure: true,	// https 환경에서만 session 정보를 주고받도록처리
//     secret: process.env.COOKIE_SECRET, // 암호화하는 데 쓰일 키
//     resave: false, // 세션을 언제나 저장할지 설정함 -> request할 때마다 session을 다시 만들겠냐
//     saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정 -> 내가 세션 사용 안할거야 근데도 만들겠냐,,
//     cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
//       httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함 -> 웹해킹 막으려고 설정함 () / 무조건 http 통신 외에는 쿠키를 보내지 않겠다
//       Secure: true https 가 아니면 안보내겠다 / CSRF찾아보기!!(XSS)
//     }, 세션 - 쿠키
//     name: 'session-cookie' // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
//   }))

// 비동기 함수(asynchronous function) : 실행 중에 다른 작업을 중단하지 않고 실행할 수 있음
// 오래 걸리는 작업을 기다리지 않고, 다른 것을 먼저 처리하려고 할 때 사용
// 네트워크 요청, 파일 시스템 엑세스, 데이터베이스 쿼리, 타이머 기반의 작업
// 만약 동기적으로 처리하면 1. 쿼리 완료될 때까지 코드 실행 멈춤
// 2. 쿼리 완료될 때까지 기다리므로 응답이 느려지거나 매우 지연
// 3. 다른 요청을 처리하는 동안 데이터베이스 연결이 끊길 수 있음
// 하지만 순서 예측 가능! 비동기적으로 처리하면 순서 예측 불가능(뭐가 언제 끝날지 어떻게 앎,,)
//Promise는 비동기 작업의 단위

// 콜백 함수
// 흐름 예측 어려움
// 콜백 지옥 - 콜백 함수가 반복되어 수정도 힘들고 가독성도 떨어짐
// setTimeout(() => {
//     console.log("A: 일을 마쳤습니다")
// }, 2000)

// setTimeout(() => {
//     console.log("B: 일을 마쳤습니다")
// }, 1500)

// setTimeout(() => {
//     console.log("C: 일을 마쳤습니다")
// }, 1000)

// .then .catch
// app.get("/", (req, res) => {
//     pool.getConnection()
//         .then(conn => {
//             conn.query("SELECT * FROM role;")
//                 .then(rows => {
//                     res.send(rows)
//                 })
//                 .catch(err => {
//                     res.status(500).send(err)
//                 })
//         })
//         .catch(err => {
//             res.status(500).send(err)
//         })
// })

// async 함수는 비동기 함수를 정의할 때 사용되는 키워드
// await 키워드는 promise가 처리될 때까지 기다림 -> 하나의 작업만 하는 것처럼 보임..?!
// await은 일반적으로 비동기 작업을 처리할 때 동기적으로 보이게 만들어 줌
// 동기적으로 보이게 만들어 줌 + 좀 더 간결한 코드
// app.get("/", async (req, res, next) => {
//     try {
//         const conn = await pool.getConnection()
//         const rows = await conn.query("SELECT * FROM role;")
//         res.status(200).send(rows)
//         conn.release()
//     } catch (err) {
//         next(err)
//     }
// })

const userRouter = require("./src/router/users")
app.use("/users", userRouter)

const postRouter = require("./src/router/posts")
app.use("/posts", postRouter)

const categoryRouter = require("./src/router/categorys")
app.use("/categorys", categoryRouter)

const commentRouter = require("./src/router/comments")
app.use("/comments", categoryRouter)
// 미들웨어 ? 서로 다른 애플리케이션이 서로 통신하는 데 사용되는 소프트웨어
// 왜 사용하지 ..? 이게 없으면 개발자는 애플리케이션에 연결된 각 소프트웨어 구성 요소의 데이터 교환 모듈을 구축해야 함 == 개발자 편리
//app.use(미들웨어) : 모든 요청에서 해당 미들웨어 실행
//app.use('/path', 미들웨어) : path로 시작하는 요청에서 미들웨어 실행
//app.post('/'path', 미들웨어) : path로 시작하는 POST 요청에서 미들웨어 실행
//next : 다음 미들웨어 실행

//정의된 라우터가 없을 때
app.use((req, res, next) => {
    next(customError(404, "router not Found"))
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err.message)
})

app.listen(8000, () => {
    console.log("8000번 포트에서 실행")
})