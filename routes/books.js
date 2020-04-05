const express = require('express');
const router = express.Router();
//use multer library to create actual book file
const multer = require('multer');
//import library built into node.js
const path = require('path');
//import new fs library ro delete unsaved book covers
const fs = require('fs');

//Array to store image type
const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/jpg', 'image/gif' ];
//Input author variable use to pass new author to author.ejs
//create our book model
const Book = require('../models/book');
//create our upload path variable, using join() which will combine 2 different paths
const uploadPath = path.join('public', Book.coverImageBasePath);
//use author model
const Author = require('../models/author');
//import multer file
const upload = multer({
	//where the upload going to be(we want to put out image file into public folder)
	//import path variable from our model(coverImageBasePath)
	dest: uploadPath,
	// filefilter allow us file which server accepts
	// (req) request of our file
	// (file) actual file Object
	// (callback) we need to call whenever we are done here
	fileFilter: (req, file, callback) => {
		callback(null, imageMimeTypes.includes(file.mimetype));
	}
});

//we can create our routes
//All books route
router.get('/', async (req, res) => {
	// need to use let inplace of const because we are reassigning the variable 'query'
	let query = Book.find();
	// search for book title
	if (req.query.title) {
		query = query.regex('title', new RegExp(req.query.title, 'i'));
	}
	// search for book Published before
	if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
		query = query.lte('publishDate', req.query.publishedBefore);
	}
	// search for book Published after
	if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
		query = query.gte('publishDate', req.query.publishedAfter);
	}

	try {
		// exec() -> will append the query variable that we declare above
		const books = await query.exec();
		res.render('books/index', {
			books: books,
			searchOptions: req.query
		});
	} catch (error) {
		res.redirect('/');
	}
});

//New book Route for displaying the form
router.get('/new', async (req, res) => {
	rendernewPage(res, new Book());
});

//Create book Route
//setting up route to accept file
router.post('/', upload.single('cover'), async (req, res) => {
	//file we are uploading to our server
	const fileName = req.file != null ? req.file.filename : null;

	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		//publish date going to return string
		publishDate: new Date(req.body.publishDate),
		pageCount: req.body.pageCount,
		coverImageName: fileName,
		description: req.body.description
	});

	try {
		//try to save the book
		const newBook = await book.save();
		// res.redirect(`books/${newBook.id}`)
		res.redirect(`books`);
	} catch (error) {
		if (book.coverImageName != null) {
			removeCoverImage(book.coverImageName);
		}

		rendernewPage(res, book, true);
	}
});

function removeCoverImage(fileName) {
	fs.unlink(path.join(uploadPath, fileName), (err) => {
		if (err) {
			console.error(err);
		}
	});
}

//Encapsulate the new book routing login
async function rendernewPage(res, book, hasError = false) {
	try {
		// get all the authors to be displayed in our view
		const authors = await Author.find({});
		// in order to create dynamic error message
		const params = {
			authors: authors,
			book: book
		};

		if (hasError) {
			params.errorMessage = 'Error Creating Book';
		}
		res.render('books/new', params);
	} catch (error) {
		res.redirect('/books');
	}
}

//exporting router to setup an application
module.exports = router;
