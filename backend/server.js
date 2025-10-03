const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS
app.use(cors());

// CSRF Protection
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Only listen if the file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export the app for testing
