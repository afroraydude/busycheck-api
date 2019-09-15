require('dotenv').config()
exports.port = process.env.port
exports.redisUri = `redis://:${process.env.dbpass}@${process.env.dbhost}:${process.env.dbport}`