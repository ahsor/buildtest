var express = require('express'),
  app = express(),
  cookieParser = require('cookie-parser'),
  session = require('express-session');

// // Simple Cookie
// app.use(cookieParser());
// app.get('/', function(req, res){
//   res.cookie("cookie", "MONSTER!")
//     .send('<img src="http://favim.com/orig/201105/04/Favim.com-33946.jpg" style="width: 15em; margin: 0 auto; display: block;">');
// });

// // // Simple Session (in Browser)
// window.localStorage.setItem("look", "This is in local storage");
// window.localStorage.getItem("look");

// // Cookie Counter
// app.use(cookieParser());
// app.get('/', function(req, res){
//   var counter = Number(req.cookies.views) || 0;
//   counter++;
//   //set cookie
//   res.cookie("views", counter)
//     .send("You've viewed this page " + counter + " times!");
// });

// // Signed Cookies
app.use(cookieParser("jemicom"));
app.get('/', function(req, res){
  // var counter = Number(req.signedCookies.views) || 0;
  // counter++;
  // //set cookie
  // res.cookie("views", counter, {signed: true})
  //   .send("You've viewed this page " + counter + " times!");
  res.setHeader('set-cookie', 'jemicom');
  res.send('set-cookie' + "jemicom")
});

// clearCookie('views'); // 쿠키 삭제

// // Add Session
//app.use(cookieParser("jemicom"));
app.use(session());

app.get('/secure', function(req, res){
  var counter = Number(req.signedCookies.views) || 0;
  counter++;
  //set session
  req.session.key = 'asdf';
  //set cookie
  res.cookie("views", counter, {signed: true})
    .send("You've viewed this page " + counter + " times!" + " session id is " + req.session.key);
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});