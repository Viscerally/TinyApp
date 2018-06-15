const express = require("express");
const bodyParser = require("body-parser"); // pulls the body parser middleware library
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const morgan = require('morgan');





var app = express();
var PORT = process.env.PORT || 8080; // default port 8080


app.use(cookieSession({
  name: 'session',
  keys: ['key'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // wires up Body Parser middleware

app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms')); //wires up morgan to log req details

// databases
var urlDatabase = {
  // "userRandomID": {
  //   "b2xVn2": "http://www.lighthouselabs.ca"
  // },
  // "user2RandomID": {
  //   "9sm5xK": "http://www.google.com"
  // }
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

//home page; 
app.get("/", (req, res) => {
  res.render("urls_home");
});



// routes for /urls etc


app.get("/urls", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);
  if (userObject) {
    var urls;
    var id = userObject.id;
    if (urlDatabase[id]) {
      urls = urlDatabase[id];
    }
    let templateVars = {
      urls: urls,
      user: userObject,
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/register");
  };
});





app.get("/urls/new", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);
  if (userObject) {
    var urls;
    var id = userObject.id;
    if (urlDatabase[id]) {
      urls = urlDatabase[id];
    }
    let templateVars = {
      urls: urls,
      user: userObject,
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls/register");
  };
});

app.post("/urls/:id", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);
  if (userObject) {
    var urls;
    var id = userObject.id;
    if (urlDatabase[id]) {
      urls = urlDatabase[id];
    }
    var shortUrl = req.params.id;
    var longUrl = req.body.longURL;
    urlDatabase[id][shortUrl] = longUrl;
    res.redirect("/urls");
  } else {
    res.redirect("/urls/register");
  };
});

app.get("/urls/:id", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);
  if (userObject) {
    var urls;
    var id = userObject.id;
    if (urlDatabase[id]) {
      urls = urlDatabase[id];
    }
    let shortURL = req.params.id;
    let regularURL = urlDatabase[id][shortURL];
    let templateVars = {
      urls: urls,
      user: userObject,
      shortURL: shortURL,
      regularURL: regularURL
    };
    res.render("urls_show", templateVars);
  }
  else {
    res.redirect("/urls/register");
  };
});

////////deletes urls
app.post("/urls/:id/delete", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);

  if (userObject) {
    var id = userObject.id;
    let short = req.params.id
    delete urlDatabase[id][short];
    res.redirect("/urls");
  }
  else {
    res.redirect("/urls/register");
  };
});

// adds url to 'database object'
app.post("/urls", (req, res) => {
  let userObject = lookUpUserObject(req.session.user_id);
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  console.log(userObject);
  if (userObject.id in urlDatabase) {
    urlDatabase[userObject.id][shortUrl] = longUrl;
  }
  else if (userObject) {
    const tempObj = {};
    tempObj[shortUrl] = longUrl;
    urlDatabase[userObject.id] = tempObj;
    console.log(urlDatabase);
  } else {
    res.redirect("/urls/register");
  };
  res.redirect("/urls");
});




// routes for login/register/logout

app.get("/login", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.render("urls_login")
  }
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  //find in users object where email is === username
  let foundUser = null;
  for (const user in users) {
    if (users[user].email === username) {
      if (bcrypt.compareSync(password, users[user].password)) {
        foundUser = users[user]
      }
    }
  }
  if (foundUser === null) {
    res.status(403).send("No matching email")
  } else {
    req.session.user_id = foundUser.id;
    res.redirect("/urls");
  }

});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("urls");
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10); //turns password into hashed password

  var userId = generateRandomString();
  var username = req.body.username;
  if (username === "" || password === "") {
    res.status(400).send("ERROR: 400 \n You didn't enter a username or password you goomba")
  }
  var userObject = {
    id: userId,
    email: username,
    password: hashedPassword
  };
  users[userId] = userObject;
  req.session.user_id = userId;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  var shortUrl = req.params.shortURL;
  var longUrl;
  for (ID in urlDatabase) {
    longUrl = urlDatabase[ID][shortUrl];

    if (longUrl) {
      break;
    }
  }
  if (longUrl) {
    res.redirect("http://" + longUrl); //this will redirect to "http://localhost:8080/u/www.bikes.com" which is a relative domain 
  }
  console.log("this is the longUrl", urlDatabase);
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});