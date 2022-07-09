
const fs = require('fs');
const crypto = require('crypto');
const util = require('util'); 
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt)

class UsersRepository extends Repository {
  async create(attrs) {
    //  attrs === { email: '', password ''}
    // assign random id to user
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      // ... notation means take attrs, rewrite over properties with new hashed password
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`,
    };

    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    // Saved - password saved in our database. "hashed.salt"
    // supplied - password enter by user when loggin on
    // const result = saved.split('.');
    // const hashed = result[0];
    // const salt = result[1];

    //  equivalent

    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }
}


// TESTING

// const test= async () => {

// const repo = new UsersRepository('users.json');

// // await repo.delete("e30be9b7");

// // const user = await repo.getOne("e30be9b7");

// // await repo.create({email: 'test@test.com', password: 'password'});

// // const users = await repo.getAll();

// // await repo.update("d2b65147", {password: "funNEwPassword"});

// const user = await repo.getOneBy({email: 'test@test.com', password: 'password'})

// console.log(user);
// };

// test();

module.exports = new UsersRepository ('users.json');
// exporting single instance of class b/c only using once in app