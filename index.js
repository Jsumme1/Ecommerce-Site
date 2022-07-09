const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app =  express();

// tells express to look at public folder for styling, images, etc
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
    keys: ['jinxiepinxie']
    })
);

app.use(authRouter);
app.use(productsRouter);

// listening for anything to happen on browser

app.listen(3000, () => {
    console.log("listening");

});
