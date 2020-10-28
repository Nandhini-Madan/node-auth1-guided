const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const usersRouter = require("./users/users-router")
const session=require("express-session")
const knexSessionStore=require("connect-session-knex")(session)
const db=require("./database/config")
const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
	resave:false, //avoid creating seesions that have not changed
	saveUninitialized:false, //GDPR laws against setting cookies automatically
	secret:"keep it secret,keep it safe", //used to crytographically sign the cookie 
	store:new knexSessionStore({
		knex:db,//configured instance of knex
		createTable:true,//if table does not exist , it will create table automatically

	})
}))

server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
