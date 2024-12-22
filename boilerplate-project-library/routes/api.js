'use strict';

const books = [];

module.exports = function (app) {
  app.route('/api/books')
    .get(function (req, res) {
      const formattedBooks = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length
      }));
      res.json(formattedBooks);
    })

    .post(function (req, res) {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }

      const newBook = {
        _id: Date.now().toString(),
        title: title,
        comments: []
      };
      books.push(newBook);
      res.json({ _id: newBook._id, title: newBook.title });
    })

    .delete(function (req, res) {
      books.length = 0;
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      const book = books.find(b => b._id === req.params.id);
      if (!book) {
        return res.send('no book exists');
      }
      res.json(book);
    })

    .post(function (req, res) {
      const comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      }

      const book = books.find(b => b._id === req.params.id);
      if (!book) {
        return res.send('no book exists');
      }

      book.comments.push(comment);
      res.json(book);
    })

    .delete(function (req, res) {
      const bookIndex = books.findIndex(b => b._id === req.params.id);
      if (bookIndex === -1) {
        return res.send('no book exists');
      }

      books.splice(bookIndex, 1);
      res.send('delete successful');
    });

};
