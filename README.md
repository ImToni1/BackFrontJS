# BackFrontJS

This is a simple web application for managing products, users, and feedback. The application uses Node.js for the backend and SQLite for the database.


## Running

Run the application using the command:
```sh
npm start
```

The application will be available at `http://localhost:8080`.

## Project Structure

- `index.js`: Main server file.
- `package.json`: Project configuration and list of dependencies.
- `html/`: Contains HTML files for different pages of the application.
  - `admin.html`: Page for managing products, users, and comments.
  - `proizvodi.html`: Page for viewing products.
  - `registracija.html`: User registration page.
  - `login.html`: User login page.
- `.vscode/launch.json`: Configuration for running the application in VS Code.

## API Routes

### Users

- `GET /api/korisnici`: Fetches all users.
- `POST /api/korisnici`: Adds a new user.
- `PUT /api/korisnici`: Updates an existing user.
- `DELETE /api/korisnici`: Deletes a user.

### Login

- `POST /api/login`: User login.

### Products

- `GET /api/proizvodi`: Fetches all products.
- `POST /api/proizvodi`: Adds a new product.
- `PUT /api/proizvodi`: Updates an existing product.
- `DELETE /api/proizvodi`: Deletes a product.

### Feedback

- `GET /api/povratne-informacije`: Fetches all feedback.
- `POST /api/povratne-informacije`: Adds new feedback.
- `DELETE /api/povratne-informacije`: Deletes feedback.

## Frontend

The frontend of the application is implemented using HTML, CSS, and JavaScript. It contains the following pages:

- `login.html`: User login page.
- `registracija.html`: User registration page.
- `proizvodi.html`: Page for viewing products with category filtering.
- `admin.html`: Page for managing products, users, and comments.

### Features

- User login and registration.
- Viewing and filtering products.
- Adding, editing, and deleting products (admin only).
- Viewing, adding, and deleting users (admin only).
- Viewing and deleting comments (admin only).

## Author

Toni Jelavić




