const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

//create a write stream in append mode. This creates a log.txt file in the root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Welcome Home log!')
});

app.get('/secreturl', (req, res)=> {
    res.send('secret cool awesomeness');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () => {
    console.log('Node server is launched');
});
