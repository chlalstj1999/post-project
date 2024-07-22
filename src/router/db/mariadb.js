const mariadb = require("mariadb")

//pool은 데이터베이스 연결을 관리하는 메커니즘으로, 성능을 향상시키고 효율성을 높이기 위해 여러 개의 연결을 재사용 / 이는 데이터베이스 연결을 매번 새로 열고 닫는 대신, 미리 일정 수의 연결을 만들어 두고 필요할 때마다 이를 사용하는 방식
// 미리 연결해둔다 == 메모리를 많이 잡아먹음
// 몇 개까지 만들어둔다 ==> 동시 접속자가 넘어서면 기다려야 함..
// db 로그인 할게
const pool = mariadb.createPool({
    host: "localhost", //서버를 또 만들면 이것도 수정해줘야함 //웹서버랑 디비서버가 분리되어있을 때
    port: "3306",
    user: "stageus",
    password: "1234",
    database: "post",
    connectionLimit: 5 //몇 개 연결을 미리 만들어두겠냐는 의미
})

module.exports = pool