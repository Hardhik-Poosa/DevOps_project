require("dotenv").config({ path: './.env' });
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS
app.use(cors());
app.use('/api/users', require('./routes/userRoutes'));
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});