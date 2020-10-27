const express =require('express'); // library
const cors = require('cors'); // module allow client to communicate with backend
const monk = require('monk'); // database communications
const Filter = require('bad-words'); // filters bad words
const rateLimit = require('express-rate-limit'); // limits requests

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


// basic get route
app.get('/', (req, res) => {
  res.json({
    message: 'SHOUTING! AH!!!'
  });
});


// app.get('/shouts', (req, res) => {
//   shouts
//     .find()
//     .then(shouts => {
//       res.json(shouts);
//     })
// });

app.get('/shouts', (req, res, next) => {

  // defualts (long-hand)
  // let skip = Number(req.query.skip) || 0;
  // let limit = Number(req.query.limit) || 10;
  let { skip = 0, limit = 4, sort= 'desc' } = req.query; // plucks out properties
  skip = parseInt(skip) || 0;
  limit = parseInt(limit) || 4;

  skip = skip < 0 ? 0 : skip;
  limit = Math.min(50, Math.max(1, limit));

  // do it simultaneously
  Promise.all([
    shouts
      .count(), // counts number of rows in db
    shouts
      .find({}, {
        skip,
        limit,
        sort: {
          created: sort === 'desc' ? -1 : 1
        }
      })
    ])
      .then(([total, shouts]) => {
        res.json( {
          meta: {
            skip,
            limit,
            total,
            has_more: (total - (skip + limit) > 0)
          },
          shouts
        })
    }).catch(next);
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
