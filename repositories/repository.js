const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a respository requires a filename");
    }
    this.filename = filename;
    // using sync version b/c using in constructor and can't use async functions within a constructor (and will only use this once)
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }


  async getAll() {
    // open the file called this.filename. read contents, resturned as string, pasrse to JSON and retun
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async writeAll(records) {
    // write the updated records array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    // passback new records array
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with ${id} not found`);
    }
    //  object takes everything from second argument (attrs) and copies it on to first argument (record)
    Object.assign(record, attrs);

    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    // for of loop - iterating through array
    for (let record of records) {
      let found = true;
      //  for in loop - iterating through object look at all keys - key value pairs
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
};
