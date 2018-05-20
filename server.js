const express = require("express");
const bodyParser = require("body-parser"); // pulls the body parser middleware library
const cookieParser = require('cookie-parser');

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.use(cookieParser())
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); // wires up Body Parser middleware


// databases
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// helper functions go here
function generateRandomString() {
  var newStr = "";
  var stringOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) {
    newStr += stringOptions.charAt(Math.floor(Math.random() * stringOptions.length));
  }
  return newStr;
}

// de facto "home page"; will change later
app.get("/", (req, res) => {
  res.end(
    "<html><body> Hello! Welcome to Tiny App!  <br />" +
    "<a href='/login'>LOGIN</a> <br />" +
    "<a href='/register'>REGISTER</a></body></html>"
  );
});



// routes for /urls etc

app.get("/urls", (req, res) => {
  let username = req.cookies.username
  console.log(username);
  let templateVars = {
    urls: urlDatabase,
    username: username
  };
  res.render("urls_index", templateVars);
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


app.get("/urls/new", (req, res) => {
  let username = req.cookies.username
  let templateVars = {
    username: username
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let username = req.cookies.username
  let shortURL = req.params.id;
  let regularURL = urlDatabase[shortURL];
  let templateVars = {
    username: username,
    shortURL: shortURL,
    regularURL: regularURL 
  };
  console.log(templateVars.regularURL);
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  var short = req.params.id
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  var shortUrl = req.params.id;
  var longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  console.log(urlDatabase[key]);
  let longURL = urlDatabase[key];
  res.redirect(longURL);
});



// routes for login/register/logout

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post ("/logout", (req, res) => {
  let username = req.body.username;
  res.clearCookie("username", username);
  res.redirect("urls");
});

app.get ("/register", (req, res) => {
  let username = req.body.username;
  res.render("urls_register");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});