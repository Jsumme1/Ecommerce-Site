const express = require("express");
const bodyParser = require("body-parser");

const app =  express();
app.use(bodyParser.urlencoded({ extended: true }));

// route handler - what to do when request received - req is data received from user/browser res is respose to user

app.get('/', (req, res) => {

    res.send( `
    <div>
         <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

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



app.post('/', (req, res) => {
    console.log(req.body);
    res.send("Account Created!!");
});

// listening for anything to happen on browser

app.listen(3000, () => {
    console.log("listening");

});
