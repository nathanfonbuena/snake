let express = require('express');

let app = express();

let path = require('path');

let session = require('express-session');

let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'static')))

let sessionConfig = {
 secret:'TheSnakeGameCookieBaby', // Secret name for decoding secret and such
 resave:false, // Don't resave session if no changes were made
 saveUninitialized: true, // Don't save session if there was nothing initialized
 name:'myCookie', // Sets a custom cookie name
 cookie: {
  secure: false, // This need to be true, but only on HTTPS
  httpOnly:false, // Forces cookies to only be used over http
  maxAge: 3600000
 }
}

// Use session with our app
app.use(session(sessionConfig));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	if( !req.session.scores ){
		req.session.scores = [];
		req.session.save();
	}
	res.render('index');
});

app.get('/scores', (req, res)=> {
	console.log("Getting scores")
	res.json(req.session.scores);
})

app.post('/score', (req, res)=> {
	console.log("Savings scores");
	req.session.scores.push(req.body.score);
	req.session.save();
	res.json(req.session.scores);
})

app.listen(6789)