const express =require('express');
const cors = require('cors');
const monk = require('monk'); // database comms
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

// create an application () <- means envoke
const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/shouting'); // connect to a databse on my local machine
const shouts = db.get('shouts'); // collection
db.then(() => {
  console.log('Connected to monk server!')
});
filter = new Filter();


app.use(cors());
app.use(express.json()); // json body parser (allows json)

// detect when '/' happens
/*
app.get('/', (req, res) => {
  res.json({
    message: 'SHOUTING! AH!!!'
  });
});
*/

app.get('/shouts', (req, res) => {
  shouts
    .find()
    .then(shouts => {
      res.json(shouts);
    })
});

function isValidShout(shout) {
  return shout.name && shout.name.toString().trim() !== '' &&
    shout.content && shout.content.toString().trim() !== '';
};

function repeatedString(string, times) {
  var repeatedString = "";
  while (times > 0) {
    repeatedString += string;
    times--;
  };
  return repeatedString;
};

// middleware (order matters)
app.use(rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 2
}));


app.post('/shouts', (req, res) => {
  if (isValidShout(req.body)) {
    // insert into db
    const numExPoints = Math.round(Math.random() * 10)
    const shout = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString().toUpperCase()).concat(repeatedString("!", numExPoints)),
      created: new Date()
    };

    console.log(shout);

    shouts.insert(shout).then(createdShout => {
        res.json(createdShout);
      });

  } else {
    res.status(422);
    res.json({
      message: 'Hey! Name and Content are required!'
    });
  }

});
// start a back-end server
app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');

});
