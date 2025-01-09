const express = require('express');
const morgan = require('morgan');
const app = express();

// app.use(morgan('common'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Wecome Home log!')
});

app.get('/secreturl', (req, res)=> {
    res.send('secret cool awesomeness');
});

app.listen(8080, () => {
    console.log('Node server is launched');
});
