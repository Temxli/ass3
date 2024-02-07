const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Added for token-based authentication
const fs = require('fs');
const path = require('path');
const app = express();
const { RecaptchaV2 } = require('express-recaptcha');
const port = 3000;


const recaptcha = new RecaptchaV2('6Lchp2opAAAAAL2qwxdDxJuaJMnsbuz-QOKSrzHP', '6Lchp2opAAAAAMkGz7r5Z4K6Bu6_ynuePro--hVY');


app.use(express.static('public')); // Assuming 'location.png' is in a 'public' directory

app.use(session({
    secret: '123456', // You should use a strong, random secret
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: '123456',
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const secretKey = '123456';



// Middleware to redirect based on user role
const redirectBasedOnRole = (req, res, next) => {
    const { role } = req.user;

    // Redirect based on user role
    if (role === 'admin') {
        res.redirect('/admin');
    } else if (role === 'moderator') {
        res.redirect('/moderator');
    } else {
        next();
    }
};


/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
*/
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with the specified role
    const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, email, hashedPassword, role || 'user']; // Default role to 'user' if not provided

    try {
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});
app.get('/success', async (req, res) => {
    const indexPath = path.join(__dirname, '..', 'client', 'index.html');

    // Send the index.html file as response
    res.sendFile(indexPath);
});


// Login route
// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
        return res.status(404).send('User not found');
    }

    const user = userResult.rows[0];

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send('Invalid password');
    }

    // Store user information in the session
    req.session.user = { id: user.id, username: user.username, role: user.role };

    // Use the middleware to redirect based on user role
    if (user.role === 'admin') {
        res.redirect('/admin');
    } else if (user.role === 'moderator') {
        res.redirect('/moderator');
    } else {
        res.redirect(`/success?username=${user.username}&role=${user.role}`);
    }
});

app.get('/authorization.html', (req, res) => {
    // Construct the absolute path to the authorization.html file
    const authorizationPath = path.join(__dirname, '..', 'client', 'authorization.html');

    // Send the authorization.html file as response
    res.sendFile(authorizationPath);
});

app.get('/teams.html', (req, res) => {
    // Construct the absolute path to the teams.html file
    const teamsPath = path.join(__dirname, '..', 'client', 'teams.html');

    // Send the teams.html file as response
    res.sendFile(teamsPath);
});



app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, email FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new route for user deletion
app.delete('/users/:username', async (req, res) => {
    const username = req.params.username;

    try {
        // Perform user deletion in the database based on the username
        const deleteQuery = 'DELETE FROM users WHERE username = $1';
        await pool.query(deleteQuery, [username]);

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).send('Error deleting user');
    }
});





app.get('/admin', (req, res) => {
    // Check if the user has 'admin' role in the session
    if (req.session.user && req.session.user.role === 'admin') {
        const indexPath = path.join(__dirname, '..', 'client', 'index.html');

        // Send the index.html file as response
        res.sendFile(indexPath);    } else {
        res.status(403).send('Access denied');
    }
});


app.get('/moderator', async (req, res) => {
    // Check if the user has 'moderator' role in the session
    if (req.session.user && req.session.user.role === 'moderator') {
        const indexPath = path.join(__dirname, '..', 'client', 'index.html');

        // Send the index.html file as response
        res.sendFile(indexPath);    } else {
        res.status(403).send('Access denied');
    }

});

app.get('/GoogleMaps.html', (req, res) => {
    const GoogleMapsPath = path.join(__dirname, '..', 'client', 'GoogleMaps.html');

    // Send the teams.html file as response
    res.sendFile(GoogleMapsPath);
});

app.get('/location', (req, res) => {
    const locationFilePath = path.join(__dirname, 'location.json');

    fs.readFile(locationFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading location.json:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const locationData = JSON.parse(data);

            // Respond with the dynamic latitude and longitude
            res.json(locationData);
        } catch (parseError) {
            console.error('Error parsing location.json:', parseError);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});


// Index page route
app.get('/', (req, res) => {
    // Check if a token is present in the URL
    const token = req.query.token;

    if (token) {
        // If a token is present, decode it and display a welcome message
        const decodedToken = jwt.decode(token);
        res.send(`Welcome ${decodedToken.email} with role ${decodedToken.role}!<br><a href="/protected">Go to Protected Route</a>`);
    } else {
        // If not authenticated, show the login page
        const indexPath = path.join(__dirname, '..', 'client', 'index.html');

        // Send the index.html file as response
        res.sendFile(indexPath);
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);


});

