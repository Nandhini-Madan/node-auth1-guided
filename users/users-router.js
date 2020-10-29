const express = require("express")
const Users = require("./users-model")
const bcrypt = require("bcryptjs")
const { restrict } = require("./users-middleware")
const router = express.Router()

router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch (err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 10),
			//password
		})

		res.status(201).json(newUser)
	} catch (err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		//will be true or false depending on whether the password matched the hash
		const passwordValid = await bycrypt.compare(password, user.password)
		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid credentials",

			})
		}
		res.json({
			message: `Welcome ${user.username}!`,
			data: `hai ${user.id}`
		})
	} catch (err) {
		next(err)
	}
})

router.get("/logout",async (req,res,next)=>{
	try{
		//delete the session on the server side, so the user is no longer authenticated
		req.session.destroy((err)=>{
			if(err){
				next(err)

			}
			else{
				res.status(204).end()
			}
		})
	}
	catch(err){
		next(err)
	}
})

module.exports = router
