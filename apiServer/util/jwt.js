const jwt = require('jsonwebtoken')
const scrict = 'safjdioajfnksjdfna;iojlsdaf'

function craetToken (payload) {
  payload.ctime = Date.now()
  return jwt.sign(payload, scrict)
}
function checkToekn(token) {
  return new Promise((resovle, reject) => {
    jwt.verify(token, scrict, (err, data) => {
      if (err) { reject('token验证失败') }
      resovle(data)
    })
  })
}

module.exports = { craetToken, checkToekn }