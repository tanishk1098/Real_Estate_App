const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router=require('./routes/router');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow all origins for simplicity; adjust in production
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
// Routes
// app.get('/', (req, res) => {
//     console.log('Root endpoint hit');
//     res.json({ message: 'Welcome to Real Estate App API!' });
// });
app.use('/api', router);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});