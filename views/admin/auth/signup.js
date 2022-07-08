const { requirePasswordConfirmation } = require("../../../routes/admin/validators");
const layout = require("../layout");

const getError = (errors, prop) => {
  // prop === email || password || password confirmation
  try {
    return errors.mapped()[prop].msg
    // errors.mapped() returns an object with key:value pairs ie email: { msg: 'Invalid email'}, passowrd:{}, passwordConfirmation{}
    //  [prop] finds appropriate subobject - email, password, passwordconfirmation, msg finds the msg
  } catch (err) {
    return '';
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: ` 
           <div>
             Your id is: ${req.session.userId}
            <form method="POST">
            <input name="email" placeholder="email"/>
            ${getError(errors, "email")}
            <input name="password" placeholder="password"/>
             ${getError(errors, "password")}
            <input name="passwordConfirmation" placeholder="password confirmation"/>
             ${getError(errors, "passwordConfirmation")}
            <button>Sign Up</button>
        </form>
    </div>
    `,
  });
};
