import { IDatabaseManager } from './idatabase-manager';

export class DatabaseManager implements IDatabaseManager {
  private db: any;
  private readonly sqlite3: any;
  constructor() {
    this.sqlite3 = require('sqlite3').verbose();
  }
  public openConnection(): boolean {
    let b: boolean = true;
    this.db = new this.sqlite3.Database('seDatabase.db', (err: { message: any }) => {
      if (err) {
        b = false;
        console.error(err.message);
      }
      console.log('Connected to the database.');
    });
    return b;
  }
  public closeConnection(): boolean {
    let b: boolean = true;
    this.db.close((err: { message: any }) => {
      if (err) {
        b = false;
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
    return b;
  }
  public executeQuery(query: string): any {
    this.db.serialize(() => {
      this.db.all(query, (err: { message: any }, rows: any) => {
        if (err) {
          console.error(err.message);
        }
        return rows;
      });
    });
  }
}
