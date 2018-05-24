const express = require("express");
const bodyParser = require("body-parser"); // pulls the body parser middleware library
const cookieParser = require('cookie-parser');

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.use(cookieParser())
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // wires up Body Parser middleware


// databases
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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

function lookUpUserObject(userId) {
  return users[userId]
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
let userObject = lookUpUserObject(req.cookies.user_id);
  let templateVars = {
    urls: urlDatabase,
    user: userObject,
  };
  res.render("urls_index", templateVars);
});





app.get("/urls/new", (req, res) => {
  //check for cookies; if cookies empty -> redirect to login else cookie will be set b/c not "falsy"  
  // if (req.cookies === false) {
    // res.redirect("urls/login")
  // } else {
    let userObject = lookUpUserObject(req.cookies.user_id);
    let templateVars = {
      user: userObject};
  
  res.render("urls_new", templateVars);
  // };
});

app.get("/urls/:id", (req, res) => {
  let userObject = lookUpUserObject(req.cookies.user_id); 
  
  let shortURL = req.params.id;
  let regularURL = urlDatabase[shortURL];
  let templateVars = {
    user: userObject,
    shortURL: shortURL,
    regularURL: regularURL
  };
  console.log(templateVars.regularURL);
  res.render("urls_show", templateVars);
});

////////deletes urls
app.post("/urls/:id/delete", (req, res) => {
  let short = req.params.id
  delete urlDatabase[short];
  res.redirect("/urls");
});
// adds url to 'database object'
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  let longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  console.log(urlDatabase[key]);
  let longURL = urlDatabase[key];
  res.redirect(longURL);
});



// routes for login/register/logout

app.get("/login", (req, res) => {
  res.render("urls_login")
});

app.post("/login", (req, res) => {
  console.log('REQ.body', req.body)
  let username = req.body.username;
  let password = req.body.password;

  //find in users object where email is === username
  let foundUser = null; 
console.log('USERS', users)
  for (const user in users) {
   if (users[user].email === username){
     foundUser = users[user]
   }  
  }
  if (foundUser === null) {
    res.status(403).send("No matching email")
  } else {
    res.cookie("user_id", foundUser.id);
    res.redirect("/urls");
  }

});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("urls");
});

app.get("/register", (req, res) => {
  let username = req.body.username;
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  let password = req.body.password;
  let userId = generateRandomString();
  let username = req.body.username;
  if (username === "" || password === "") {
    res.status(400).send("ERROR: 400 \n You didn't enter a username or password you goomba")
  }
  let userObject = {
    id: userId,
    email: username,
    password: password
  };
  users[userId] = userObject;

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});