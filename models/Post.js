const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		default: Date.now,
	},
	author: {
		type: String,
		required: true,
	},
});

const PostModel = mongoose.model("Posts", PostSchema);

module.exports = PostModel;