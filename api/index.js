// Import required packages
const User = require('./models/User');
const Data = require('./models/Data');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Load environment variables from .env file
dotenv.config();

// Set up port and MongoDB connection string
const port = process.env.PORT || 4040;
const mongoUrl = process.env.MONGO_URL;
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;
// Connect to MongoDB using Mongoose
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Create Express app instance
const app = express();

// Set up middleware
app.use(cors({
    credentials: true,
    origin: clientUrl
}));
app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req, res) => {

    const { username, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const userDoc = await User.create({
            username: username,
            password: hashedPassword
        });
        res.json(userDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user.' });
    }

});

app.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk) {
        return res.status(400).json({ error: 'Wrong credentials' });
    }

    jwt.sign({ username, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create token' });
        }
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).json({
            id: userDoc._id,
            username
        });
    });

});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        // No token found in cookie
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    jwt.verify(token, jwtSecret, {}, (err, info) => {
        if (err) {
            // Invalid token
            res.clearCookie('token').status(401).json({ error: 'Unauthorized' });
            return;
        }
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', { sameSite: 'none', secure: true }).json('ok');
});

app.post('/data', async (req, res) => {
    try { 
        const { token } = req.cookies;
        jwt.verify(token, jwtSecret, {}, async (err, info) => {
            if (err) {
                res.clearCookie('token').status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { name, age, email, gender } = req.body;
            const userData = await Data.create({
                name,
                age,
                email,
                gender,
                author: info.id,
            })
            res.status(201).json(userData);
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not create transaction' });
    }
})

app.get('/data', async (req, res) => {
    try {
        const { token } = req.cookies;
        jwt.verify(token, jwtSecret, {}, async (err, info) => {
            if (err) {
                res.clearCookie('token').status(401).json({ error: 'Unauthorized' });
                return;
            }

            const userData = await Data.find({ author: info.id });
            res.status(200).json(userData);
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve data' });
    }
});

app.delete('/data/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const userData = await Data.findByIdAndDelete(userId);
        if (!userData) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(userData);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Could not delete transaction' });
    }
})

app.put('/data/:id', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
        if (err) {
            res.clearCookie('token').status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        const { _id, name, age, email,gender } = req.body;
        const userData = await Data.findById(_id);
        const isAuthor = JSON.stringify(Data.author) === JSON.stringify(info._id);
        if (!isAuthor) {
            res.status(400).json({ error: 'you are not the author' })
            return;
        }

        await userData.updateOne({
            name,
            age,
            email,
            gender,
        });

        res.json(userData)
    });
})

// Start Express app listening on specified port
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
