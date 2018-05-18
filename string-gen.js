function generateRandomString() {
  var newStr = "";
  var stringOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    newStr += stringOptions.charAt(Math.floor(Math.random() * stringOptions.length));
  return newStr;

}




  

console.log(generateRandomString());