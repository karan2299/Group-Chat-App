const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://127.0.0.1/groupChat', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('error', (err) => {
    console.log('err', err);
    throw err;
});

mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
});
// Routes
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/messages', messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
