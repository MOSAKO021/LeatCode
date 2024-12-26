const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path');
const axios = require('axios');
app.use(express.static('public'));

app.use(cors({
    origin: '*'
}))

// let leet = require('./leetcode');
// app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// app.get('/:id', leet.leetcode);

const response = axios.get("https://leetcode.com/u/wolfofdst01");
console.log(response);


app.listen(8000, () => {
    console.log(`App is running at http://localhost:3000`);
});