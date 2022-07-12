const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require("./routes/carts");

const app =  express();

// tells express to look at public folder for styling, images, etc
app.use(express.static('public'));
// body parser below can not handle multipart form requests - images can't be packaged as url - too much data when urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
    keys: ['jinxiepinxie']
    })
);

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

// listening for anything to happen on browser

app.listen(3000, () => {
    console.log("listening");

});
