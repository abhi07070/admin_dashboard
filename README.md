In the Client side, you can run:
### `yarn start`

### `Berif Description about client side project`

client-side React project that implements a user registration and login system, as well as an admin page for managing user data. The project consists of three components: RegisterPage, LoginPage, and AdminPage.

1 - In RegisterPage, the user can input a username and password to register. The component uses useState to manage the state of the input fields and validation messages. When the user submits the registration form, the component sends a POST request to http://localhost:4000/register using axios. If the registration is successful, the component displays a success message and a link to the login page.

2- In LoginPage, the user can input their username and password to log in. The component uses useState to manage the state of the input fields. When the user submits the login form, the component sends a POST request to http://localhost:4000/login using axios. If the login is successful, the component saves the user information in the UserContext and redirects to the home page.

3 - In AdminPage, the user can view and manage user data. The component uses useState to manage the state of the input fields and useEffect to fetch user data from http://localhost:4000/data when the component mounts. The component also uses Yup to define a validation schema for the user data. When the user submits the user data form, the component sends a POST request to http://localhost:4000/data using axios. The component also displays a modal to confirm the user data submission. If the submission is successful, the component updates the user data and displays a success message.


In the Backend side, you can run:
### `node index.js`

### `Berif Description about Backend side project`

Backend code written in JavaScript using the Express framework for handling HTTP requests and responses. The code connects to a MongoDB database using the Mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.

The code defines several routes for handling different HTTP requests. It defines the following routes:

1 - POST /register: This route is used for user registration. It accepts a username and password in the request body, and creates a new user document in the database.

2 - POST /login: This route is used for user authentication. It accepts a username and password in the request body, and checks if the user exists in the database and if the password is correct. If the authentication is successful, it creates a JWT token and sends it to the client in a HTTP-only cookie.

3 - GET /profile: This route is used for retrieving the user profile. It reads the JWT token from the cookie and verifies it. If the verification is successful, it sends the user information back to the client.

4 - POST /logout: This route is used for logging out the user. It clears the JWT token from the cookie.

5 - POST /data: This route is used for creating new data records for the user. It accepts a name, age, email, and gender in the request body, and creates a new data document in the database associated with the user.

6 - GET /data: This route is used for retrieving the data records for the user. It reads the JWT token from the cookie, verifies it, and retrieves all data records associated with the user.

7 - DELETE /data/:id: This route is used for deleting a data record for the user. It accepts a data record ID as a URL parameter and deletes the corresponding document from the database.

8 - PUT /data/:id: This route is used for updating a data record for the user. It accepts a data record ID as a URL parameter and updates the corresponding document in the database.

The code also uses several middleware functions provided by the Express framework, such as CORS for enabling cross-origin requests, body-parser for parsing JSON request bodies, cookie-parser for parsing cookies, and error handling middleware functions for handling errors that occur during request processing.