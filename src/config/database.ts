import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'todolist';

class Database {
  private static instance: MongoClient;

  static async connect(): Promise<MongoClient> {
    if (!this.instance) {
      this.instance = await MongoClient.connect(url);
      console.log('Connected successfully to MongoDB');
    }
    return this.instance;
  }

  static getClient(): MongoClient {
    return this.instance;
  }

  static getDb() {
    return this.instance.db(dbName);
  }
}

export default Database;
