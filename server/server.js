const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Config .env to ./config/config.env
require('dotenv').config({
    path: './config/config.env'
});

// Use bodyParser to parse JSON
const app = express();
app.use(express.json());

// Config for only development
if(process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }));

    app.use(morgan('dev'));
    // Morgan give infromation about each request 
    // Cors it's allow to deal with react for localhost at PORT 3000 without any problem
}

// Load all routes
const authRouter = require('./routes/auth.route');

// User Routes
app.use('/api/', authRouter);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Page not found'
    })
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});