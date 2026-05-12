require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

const path = require('path');
const express = require('express');

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});