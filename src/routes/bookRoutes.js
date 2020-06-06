const express = require('express');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Le Nikloayevich Tolstoy',
      read: false,
    },
    {
      title: 'Book B',
      genre: 'Science Fiction',
      author: 'Author B',
      read: false,
    },
    {
      title: 'Book C',
      genre: 'Fantasy',
      author: 'Author C',
      read: false,
    },
    {
      title: 'Book D',
      genre: 'Historical Fiction',
      author: 'Author D',
      read: false,
    },
    {
      title: 'Book E',
      genre: 'Historical Fiction',
      author: 'Author E',
      read: false,
    },
    {
      title: 'Book F',
      genre: 'Historical Fiction',
      author: 'Author F',
      read: false,
    },
  ];

  bookRouter.route('/')
    .get((req, res) => {
      res.render(
        'bookListView',
        {
          nav,
          title: 'Library',
          books,
        },
      );
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: books[id],
        },
      );
    });

  return bookRouter;
}

module.exports = router;
