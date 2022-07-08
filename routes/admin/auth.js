const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();


// route handler - what to do when request received - req is data received from user/browser res is respose to user
router.get("/signup", (req, res) => {
  res.send(`
    <div>
    Your id is: ${req.session.userId}
         <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
    `);
});



router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send("Email has already been used");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match!");
  }
  // create user in user report to represent that person
  const user = await usersRepo.create({ email, password });
  // store the id of that user inside the users cookie  - use cookie-session library to manage cookies
  // req.session - added and maintained by cookie session
  req.session.userId === user.id;

  res.send("Account Created!!");
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(`  
     <div>
            <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <button>Sign In</button>
        </form>
    </div>
      
    `);
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;
  res.send("You are signed in!");
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