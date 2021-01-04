import * as sqlite3 from 'sqlite3';

import { IDatabaseManager } from './idatabase-manager';

export class DatabaseManager implements IDatabaseManager {
  private db: sqlite3.Database;
  private readonly sqlite3: sqlite3.sqlite3;
  constructor() {
    this.sqlite3 = sqlite3.verbose();
  }
  public openConnection(): boolean {
    let b: boolean = true;
    this.db = new this.sqlite3.Database('seDatabase.db', (err: Error | null) => {
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
    this.db.close((err: Error | null) => {
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
      this.db.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
        }
        return rows;
      });
    });
  }
}
