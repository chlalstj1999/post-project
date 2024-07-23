const { Pool } = require("pg")

const client = new Pool({
    "user" : "ubuntu",
    "password" : "1234",
    "port" : 5432,
    "host" : "localhost",
    "max" : 5,
    "database" : "post"
})

client.connect()

module.exports = client