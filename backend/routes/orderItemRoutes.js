const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// OrderItem 라우트 파일
const orderItemRoutes = express.Router();
let orderItemDb = new sqlite3.Database(
  path.join(__dirname, "../database", "orderitem.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to orderitem database:", err.message);
    } else {
      console.log("Connected to the orderitem database.");
    }
  }
);
// 모든 주문 항목 조회
orderItemRoutes.get("/", (req, res) => {
  const sql = "SELECT * FROM OrderItem";
  orderItemDb.all(sql, [], (err, rows) => {
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

module.exports = orderItemRoutes;
