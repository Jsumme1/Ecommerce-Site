const express = require('express');

const { handleErrors } = require("./middlewares");
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUSer} = require('./validators');

const router = express.Router();


// route handler - what to do when request received - req is data received from user/browser res is respose to user
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});



router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  //   communication from validators passed to function via req object
  async (req, res) => {
   const { email, password } = req.body;

    // create user in user report to represent that person
    const user = await usersRepo.create({ email, password });
    // store the id of that user inside the users cookie  - use cookie-session library to manage cookies
    // req.session - added and maintained by cookie session
    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post("/signin", 
[requireEmailExists, requireValidPasswordForUSer],
handleErrors(signinTemplate),
 async (req, res) => {
   const { email } = req.body;

  const user = await usersRepo.getOneBy({ email });

  req.session.userId = user.id;
  res.redirect("/admin/products");
});

module.exports = router;

// // middleware helper function to parse body of request - reusable
// const bodyParser = (req, res, next) => {
//    // get access to email, password and password confirmation
//    if(req.method ==='POST'){
//     req.on('data', data => {
//         // parses data from buffer array to key value pairs
//     const parsed =data.toString('utf8').split('&');
//     const formData ={};
//     for (let pair of parsed) {
//         const [key, value] = pair.split('=');
//         formData [key]=value;
//     }
//     req.body = formData;
//     next();
//    });
//    }  else {
//     next();
//    }
// };