const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const User = require("../models/User.js");

router.post("/register", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error?.details[0].message);

		const usernameExists = await User.findOne({
			username: req.body.username,
		});
		if (usernameExists) return res.status(400).send("Username already exists");

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			username: req.body.username,
			password: hashPassword,
		});
		const savedUser = await user.save();

		const token = jwt.sign(
			{
				_id: savedUser._id,
			},
			process.env.JWT_SECRET
		);

		res.header("token", token).send({
			data: {
				token,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error?.details[0].message);

		const user = await User.findOne({
			username: req.body.username,
		});
		if (!user) return res.status(400).send("Invalid username or password");

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(400).send("Invalid username or password");

		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.JWT_SECRET
		);

		res.header("token", token).send({
			data: {
				token,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
});

const validate = (body) => {
  const validationSchema = joi.object({
		username: joi.string().alphanum().min(3).max(30).required(),
		password: joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
			.required(),
	});
	return validationSchema.validate(body);
};

module.exports = router;