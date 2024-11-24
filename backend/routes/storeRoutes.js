const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// Store 라우트 파일
const storeRoutes = express.Router();
let storeDb = new sqlite3.Database(
  path.join(__dirname, "../database", "store.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to store database:", err.message);
    } else {
      console.log("Connected to the store database.");
    }
  }
);

// 모든 매장 조회
storeRoutes.get("/", (req, res) => {
  const sql = "SELECT * FROM Store";
  storeDb.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// 특정 매장 조회 및 월간 매출액, 단골 고객 조회
storeRoutes.get("/:id", (req, res) => {
  const storeId = req.params.id;
  const storeSql = "SELECT * FROM Store WHERE Id = ?";
  const salesSql =
    'SELECT strftime("%Y-%m", OrderAt) AS Month, SUM(Item.UnitPrice) AS Revenue, COUNT(OrderItem.ItemId) AS Count FROM Orders INNER JOIN OrderItem ON Orders.Id = OrderItem.OrderId INNER JOIN Item ON OrderItem.ItemId = Item.Id WHERE StoreId = ? GROUP BY Month';
  const customersSql =
    "SELECT User.Id, User.Name, COUNT(Orders.Id) AS Frequency FROM Orders INNER JOIN User ON Orders.UserId = User.Id WHERE StoreId = ? GROUP BY User.Id, User.Name ORDER BY Frequency DESC LIMIT 10";

  storeDb.get(storeSql, [storeId], (err, storeRow) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!storeRow) {
      res.status(404).json({ message: "Store not found" });
      return;
    }

    storeDb.all(salesSql, [storeId], (err, salesRows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      storeDb.all(customersSql, [storeId], (err, customerRows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          message: "success",
          store: storeRow,
          monthlySales: salesRows,
          topCustomers: customerRows,
        });
      });
    });
  });
});

module.exports = storeRoutes;
