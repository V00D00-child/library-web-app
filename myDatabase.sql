CREATE DATABASE node_course;

USE node_course;

CREATE TABLE books (title varchar(255), author varchar(255));

-- Alter table
ALTER TABLE books ADD id int; 

INSERT INTO books (id, title, author) VALUES
(1, 'War and Peace', 'Lev Nikolayevich Tolstoy'),
(2, 'Les Miserables', 'Victor Hugo'),
(3, 'The Time Machine', 'H. G. Wells'),
(4, 'A Journey into the Center of the Earth','Jules Verne'),
(5, 'The Dark World', 'Herny Kuttner'),
(6, 'The Wind in the Willows', 'Kenneth Grahame'),
(7, 'Life On the Mississippi', 'Mark Twain'),
(8, 'Childhood', 'Lev Nikolayevich Tolstoy');

-- Update table
alter table books add primary key(id);
UPDATE books
SET title = 'A Journey into the Center of the Earth'
WHERE id = 4;

-- SELECT all
select * from books;



