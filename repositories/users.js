
const fs = require('fs');
const crypto = require('crypto');
const util = require('util'); 

const scrypt = util.promisify(crypto.scrypt)

class UsersRepository {
    constructor(filename) {
        if (!filename){
            throw new Error ('Creating a respository requires a filename');
        }
    this.filename = filename;
    // using sync version b/c using in constructor and can't use async functions within a constructor (and will only use this once)
    try {
        fs.accessSync(this.filename);
    } catch(err) {
        fs.writeFileSync(this.filename, '[]');
    }
   }
   async getAll(){
    // open the file called this.filename. read contents, resturned as string, pasrse to JSON and retun
   return JSON.parse(
    await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
         })
      );
   }
   async create(attrs) {
    //  attrs === { email: '', password ''}
    // assign random id to user
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
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

const [hashed, salt] = saved.split('.');
const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

return hashed === hashedSuppliedBuf.toString('hex');

};

   async writeAll(records) {
     // write the updated records array back to this.filename
     await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
   }

   randomId() {
    return crypto.randomBytes(4).toString('hex');
   }

   async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id ===id);
   }

   async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    // passback new records array
    await this.writeAll(filteredRecords);

   }

   async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
        throw new Error (`Record with ${id} not found`)
       }
//  object takes everything from second argument (attrs) and copies it on to first argument (record)
    Object.assign(record, attrs);

    await this.writeAll(records);

   }

   async getOneBy(filters){
    const records = await this.getAll();
    
    // for of loop - iterating through array
    for (let record of records){
        let found = true;
        //  for in loop - iterating through object look at all keys - key value pairs
      for (let key in filters) {
        if(record[key] !==filters[key]) {
            found = false;
        }
      }   
      
      if (found) {
        return record;
      }

    }

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