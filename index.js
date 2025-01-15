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

app.get('/movies', (req, res)=> {
    const movieList = [
         {
            title: 'Django Unchained',
            director: 'Quentin Tarantino',
            Actors: 'Jamie Foxx, Christoph Waltz, Leonardo DiCaprio',
            Genre: 'Dark Comedy, Drama, Western', 
            Release: '2012'
         },
         {
            title: 'There Will Be Blood',
            director: 'Paul Thomas Anderson',
            Actors: 'Daniel Day Lewis, Paul Dano, Ciaran Hinds',
            Genre: 'Drama',
            Release: '2007'
         },
         {
            title: 'Once Upon a Time... in Hollywood',
            director: 'Quentin Tarantino',
            Actors: 'Leonardo DiCaprico, Brad Pitt, Margot Robbie',
            Genre: 'Comedy, Drama',
            Release: '2019'
         },
         {
            title: 'Dunkirk',
            director: 'Christopher Nolan',
            Actors: 'Fionn Whitehead, Barry Keoghan, Mark Rylance',
            Genre: 'Action , History',
            Release: '2017'
         },
         {
            title: 'No Country for Old Men',
            director: 'Ethan Cohen, Joel Cohen',
            Actors: 'Tommy Lee Jones, Javier Bardem, Josh Brolin',
            Genre: 'Thriller, Drama',
            Release: '2007'
         },
         {
            title: "The Royal Tenenbaums",
            director: 'Wes Anderson',
            Actors: 'Gene Hackman, Gwyneth Paltrow, Anjelica Huston',
            Genre: 'Comedy, Drama',
            Release: '2001'
         },
         {
            title: 'Inglorious Basterds',
            director: 'Quentin Tarantino',
            Actors: 'Brad Pitt, Diane Kruger, Eli Roth',
            Genre: 'Dark Comedy, War',
            Release: '2009'
         },
         {
            title: 'Good Will Hunting',
            director: 'Gus Van Zant',
            Actors: 'Robin Williams, Matt Damon, Ben Affleck',
            Genre: 'Drama, Romance',
            Release: '1997'
         },
         {
            title: '1917',
            director: 'Sam Mendez',
            Actors: 'Dean-Charles Chapman, George MacKay, Daniel Mays',
            Genre: 'Action, War',
            Release: '2019'
         },
         {
            title: 'Darkest Hour',
            director: 'Joe Wright',
            Actors: 'Gary Oldman, Lily James, Kristin Scott Thomas', 
            Genre: 'Drama, War',
            Release: '2017'
         },
    ];
    res.status(200).send(movieList);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

app.listen(8080, () => {
    console.log('Node server is launched');
});
