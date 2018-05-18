const express = require("express");
const bodyParser = require("body-parser"); // pulls the body parser middleware library

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); // wires up Body Parser middleware


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var newStr = "";
  var stringOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
  newStr += stringOptions.charAt(Math.floor(Math.random() * stringOptions.length));
  return newStr;
  
}


app.get("/", (req, res) => {
  res.end("<html><body> Hello! Welcome to Tiny App </body></html>");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello<b>World</b></body></html>\n");
});



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  var short = req.params.id
  // console.log('Short' + short);
   delete urlDatabase[short];
  res.redirect("/urls");
  
});


app.post("/urls/:id", (req, res) => {
  // let templateVars = { shortURL: req.params.id };
  // urlDatabase.id = req.body.longURL; 
  // res.render("urls_show", templateVars);
  // console.log(req.body);

  var shortUrl = req.params.id;
  var longUrl = req.body.longURL;

  urlDatabase[shortUrl] = longUrl;

  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let nuts = urlDatabase[shortURL];
  let templateVars = {
    shortURL: shortURL,
    regularURL: nuts
  };
  console.log(templateVars.regularURL);
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.post("/urls/:id", (req, res) => {
  let key = req.params.id;
  console.log('looking for this: ', req.params.id);
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
//   // console.log(req.body);  // debug statement to see POST parameters
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  console.log(urlDatabase[key]);
  let longURL = urlDatabase[key];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});