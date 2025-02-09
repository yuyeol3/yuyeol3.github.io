const express = require('express');
const path = require('path');

// import express from 'express';
// import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});