# library-web-app
This is a simple Node web application that uses ejs template engine and passport for user authentication.

Users are able to register for accounts, and view books in the library inventory. Admin accounts are allowed to add books to library inventory from a protect /auth route that is only accessible to users with ADMIN role. All routes are protect and will redirect to login page if user tries to access without being loggged in.

# Routes
/books - Fetchs all books from database and return view to client(GET)

/books:id - Fetchs single book from database and return view to client(GET)

/admin - Creates new books in library database(POST)

/auth/signup - Create a users in database and stores password as hash with salt and secret app key.(POST)

/auth/signin - Return view to client for login page.(GET)

/auth/signin - Authenicates a user by using password and user name.(POST)

/auth/profile - Return view that displays information about currently logged in user(GET) 

/auth/logout - Logs a user out of application(GET)

## Technologies
Node.js
MySQL
Passport
ejs
