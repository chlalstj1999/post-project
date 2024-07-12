const idRegx = /^[a-zA-Z0-9]{5,15}$/
const pwRegx = /^(?=.*[a-zA-Z])(?=.*\d).{8,15}$/
const userNameRegx = /^[가-힣]{2,5}$/
const emailRegx =  /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
const gender = /^[M|W]$/
const birth = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/
const categoryNameRegx = /^{1,10}$/
const postTitleRegx = /^{1,30}$/
const postContentRegx = /^{1,500}$/
const commentRegx = /^{1,100}$/

module.exports = { idRegx, pwRegx, userNameRegx, emailRegx, gender, birth, categoryNameRegx, postTitleRegx, postContentRegx, commentRegx }