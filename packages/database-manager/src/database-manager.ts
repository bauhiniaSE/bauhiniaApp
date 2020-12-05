const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('seDatabase.db', (err: { message: any }) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {
  db.each(
    `SELECT id as id,
                    name as name
             FROM objects`,
    (err: { message: any }, row: { id: string; name: string }) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + '\t' + row.name);
    }
  );
});

db.close((err: { message: any }) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
