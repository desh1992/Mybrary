const express = require('express');
const router = express.Router();
//Input author variable use to pass new author to author.ejs
const Author = require('../models/author');

//we can create our routes
//All authors route
router.get('/', async (req, res) => {
	//Create search options to search parameter(we have only name)
	let searchOptions = {}
	if (req.query.name != null && req.query.name !== '') {
		searchOptions.name = new RegExp(req.query.name, 'i')
	}
	try {
		const authors = await Author.find(searchOptions)
		//Render our view index.ejs
		res.render('authors/index', {
			authors: authors,
			searchOptions: req.query
		});
	} catch {
		res.redirect('/')
	}
	
});

//New Author Route for displaying the form
router.get('/new', (req, res) => {
	res.render('authors/new', { author: new Author() });
});

//Create Author Route
router.post('/', async (req, res) => {
	const author = new Author({
		name: req.body.name //Parameters accept from client(name) because client can send other stuff(_id)
	});
	try {
		const newAuthor = await author.save()
		// res.redirect(`/authors/${newAuthor.id}`)
		res.redirect(`authors`)
	} catch{
		res.render('authors/new', {
			author: author,	//repopulating the new author name entered
			errorMessage:'Error Creating Author'
		})

	}
	/**
	 * this code can be writen cleaner
	 * using try and catch block
	 */
	// author.save((err, newAuthor) => {
	// 	if (err) {
	// 		res.render('/authors/new', {
	// 			author: author, //repopulating the new author name entered
	// 			errorMessage: 'Error creating Author'
	// 		});
	// 	} else {
	// 		// res.redirect(`authors/${newAuthor.id}`); //using stringinterpolation so use backticks(`)
	// 		res.redirect('/authors');
	// 	}
	// });
});

//exporting router to setup an application
module.exports = router;
