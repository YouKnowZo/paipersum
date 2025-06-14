const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const analyze = require('./api/analyze');
const upload = require('./api/upload');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/analyze', analyze);
app.use('/api/upload', upload);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
