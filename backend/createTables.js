const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// User 데이터베이스 파일 생성 및 연결 및 데이터 삽입
let userDb = new sqlite3.Database(
  path.join(__dirname, "database", "user.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the user database.");
  }
);

userDb.serialize(() => {
  userDb.run(`
    CREATE TABLE IF NOT EXISTS User (
        Id TEXT PRIMARY KEY,
        Name TEXT,
        Gender TEXT,
        Age INTEGER,
        Birthdate TEXT,
        Address TEXT
    );
  `);

  const insertUser = userDb.prepare(
    "INSERT INTO User (Id, Name, Gender, Age, Birthdate, Address) VALUES (?, ?, ?, ?, ?, ?)"
  );

  fs.createReadStream(path.join(__dirname, "data", "user.csv"))
    .pipe(csv())
    .on("data", (row) => {
      insertUser.run(
        row.Id,
        row.Name,
        row.Gender,
        row.Age,
        row.Birthdate,
        row.Address
      );
    })
    .on("end", () => {
      console.log("User data inserted successfully.");
      insertUser.finalize();
    });
});

userDb.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the user database connection.");
});

// Store 데이터베이스 파일 생성 및 연결 및 데이터 삽입
let storeDb = new sqlite3.Database(
  path.join(__dirname, "database", "store.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the store database.");
  }
);

storeDb.serialize(() => {
  storeDb.run(`
    CREATE TABLE IF NOT EXISTS Store (
        Id TEXT PRIMARY KEY,
        Name TEXT,
        Type TEXT,
        Address TEXT
    );
  `);

  const insertStore = storeDb.prepare(
    "INSERT INTO Store (Id, Name, Type, Address) VALUES (?, ?, ?, ?)"
  );

  fs.createReadStream(path.join(__dirname, "data", "store.csv"))
    .pipe(csv())
    .on("data", (row) => {
      insertStore.run(row.Id, row.Name, row.Type, row.Address);
    })
    .on("end", () => {
      console.log("Store data inserted successfully.");
      insertStore.finalize();
    });
});

storeDb.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the store database connection.");
});

// Item 데이터베이스 파일 생성 및 연결 및 데이터 삽입
let itemDb = new sqlite3.Database(
  path.join(__dirname, "database", "item.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the item database.");
  }
);

itemDb.serialize(() => {
  itemDb.run(`
    CREATE TABLE IF NOT EXISTS Item (
        Id TEXT PRIMARY KEY,
        Name TEXT,
        Type TEXT,
        UnitPrice INTEGER
    );
  `);

  const insertItem = itemDb.prepare(
    "INSERT INTO Item (Id, Name, Type, UnitPrice) VALUES (?, ?, ?, ?)"
  );

  fs.createReadStream(path.join(__dirname, "data", "item.csv"))
    .pipe(csv())
    .on("data", (row) => {
      insertItem.run(row.Id, row.Name, row.Type, row.UnitPrice);
    })
    .on("end", () => {
      console.log("Item data inserted successfully.");
      insertItem.finalize();
    });
});

itemDb.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the item database connection.");
});

// Order 데이터베이스 파일 생성 및 연결 및 데이터 삽입
let orderDb = new sqlite3.Database(
  path.join(__dirname, "database", "order.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the order database.");
  }
);

orderDb.serialize(() => {
  orderDb.run(`
    CREATE TABLE IF NOT EXISTS Orders (
        Id TEXT PRIMARY KEY,
        OrderAt TEXT,
        StoreId TEXT,
        UserId TEXT,
        FOREIGN KEY (StoreId) REFERENCES Store(Id),
        FOREIGN KEY (UserId) REFERENCES User(Id)
    );
  `);

  const insertOrder = orderDb.prepare(
    "INSERT INTO Orders (Id, OrderAt, StoreId, UserId) VALUES (?, ?, ?, ?)"
  );

  fs.createReadStream(path.join(__dirname, "data", "order.csv"))
    .pipe(csv())
    .on("data", (row) => {
      insertOrder.run(row.Id, row.OrderAt, row.StoreId, row.UserId);
    })
    .on("end", () => {
      console.log("Order data inserted successfully.");
      insertOrder.finalize();
    });
});

orderDb.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the order database connection.");
});

// OrderItem 데이터베이스 파일 생성 및 연결 및 데이터 삽입
let orderItemDb = new sqlite3.Database(
  path.join(__dirname, "database", "orderitem.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the orderitem database.");
  }
);

orderItemDb.serialize(() => {
  orderItemDb.run(`
    CREATE TABLE IF NOT EXISTS OrderItem (
        Id TEXT PRIMARY KEY,
        OrderId TEXT,
        ItemId TEXT,
        FOREIGN KEY (OrderId) REFERENCES Orders(Id),
        FOREIGN KEY (ItemId) REFERENCES Item(Id)
    );
  `);

  const insertOrderItem = orderItemDb.prepare(
    "INSERT INTO OrderItem (Id, OrderId, ItemId) VALUES (?, ?, ?)"
  );

  fs.createReadStream(path.join(__dirname, "data", "orderitem.csv"))
    .pipe(csv())
    .on("data", (row) => {
      insertOrderItem.run(row.Id, row.OrderId, row.ItemId);
    })
    .on("end", () => {
      console.log("OrderItem data inserted successfully.");
      insertOrderItem.finalize();
    });
});

orderItemDb.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the orderitem database connection.");
});
