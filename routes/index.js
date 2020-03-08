const express = require('express');
const router = express.Router();

//we can create our routes
router.get('/', (req, res) => {
	//Render our view index.ejs
	res.render('index');
});

//exporting router to setup an application
module.exports = router;
