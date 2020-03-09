const mongoose = require('mongoose');

//create schema(In MONGODB schema is same as table in database)
const authorSchema = new mongoose.Schema({
	//Create Columns(In MONGODB columns are in JSON format)
	name: {
		type: String,
		required: true
	}
});

//export the schema(Author as Table name)
module.exports = mongoose.model('Author', authorSchema);
