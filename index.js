const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app =  express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
    keys: ['jinxiepinxie']
    })
);

app.use(authRouter);

// listening for anything to happen on browser

app.listen(3000, () => {
    console.log("listening");

});
