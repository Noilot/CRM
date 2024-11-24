const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// Order 라우트 파일
const orderRoutes = express.Router();
let orderDb = new sqlite3.Database(
  path.join(__dirname, "../database", "order.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to order database:", err.message);
    } else {
      console.log("Connected to the order database.");
    }
  }
);

// 모든 주문 조회
orderRoutes.get("/", (req, res) => {
  const sql = "SELECT * FROM Orders";
  orderDb.all(sql, [], (err, rows) => {
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

// 특정 주문 조회
orderRoutes.get("/:id", (req, res) => {
  const sql =
    "SELECT Orders.Id, OrderItem.OrderId, OrderItem.ItemId, Item.Name AS ItemName FROM Orders INNER JOIN OrderItem ON Orders.Id = OrderItem.OrderId INNER JOIN Item ON OrderItem.ItemId = Item.Id WHERE Orders.Id = ?";
  const params = [req.params.id];
  orderDb.all(sql, params, (err, rows) => {
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

module.exports = orderRoutes;
