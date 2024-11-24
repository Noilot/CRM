const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const itemRoutes = express.Router();

const itemDbPath = path.resolve(__dirname, "../database/item.db");
const orderDbPath = path.resolve(__dirname, "../database/order.db");
const orderItemDbPath = path.resolve(__dirname, "../database/orderitem.db");
const itemDb = new sqlite3.Database(itemDbPath);
const orderDb = new sqlite3.Database(orderDbPath);
const orderItemDb = new sqlite3.Database(orderItemDbPath);

// 전체 아이템 목록 조회 API
itemRoutes.get("/", (req, res) => {
  const sql = "SELECT * FROM Item";
  itemDb.all(sql, [], (err, rows) => {
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

// 특정 아이템 및 월간 매출 데이터 조회 API
itemRoutes.get("/:itemId", (req, res) => {
  const itemId = req.params.itemId;

  try {
    // 아이템 기본 정보 가져오기
    itemDb.get(`SELECT * FROM Item WHERE Id = ?`, [itemId], (err, item) => {
      if (err) {
        console.error("Error fetching item details:", err);
        res.status(500).json({ error: "Failed to fetch item details" });
      } else if (!item) {
        console.log(`Item not found for itemId: ${itemId}`);
        res.status(404).json({ error: "Item not found" });
      } else {
        console.log("Item details fetched successfully:", item);

        // OrderItem 데이터 가져오기
        orderItemDb.all(
          `SELECT * FROM OrderItem WHERE ItemId = ?`,
          [itemId],
          (err, orderItems) => {
            if (err) {
              console.error("Error fetching order items:", err);
              res.status(500).json({ error: "Failed to fetch order items" });
            } else {
              console.log("Order items fetched:", orderItems);
              const orderIds = orderItems.map((oi) => oi.OrderId);

              if (orderIds.length === 0) {
                console.log("No order items found for the given item.");
                res.json({ item, monthlySales: [] });
              } else {
                // Orders 데이터 가져오기
                const placeholders = orderIds.map(() => "?").join(", ");
                orderDb.all(
                  `SELECT * FROM Orders WHERE Id IN (${placeholders})`,
                  orderIds,
                  (err, orders) => {
                    if (err) {
                      console.error("Error fetching orders:", err);
                      res.status(500).json({ error: "Failed to fetch orders" });
                    } else {
                      console.log("Orders fetched:", orders);

                      // 가상의 테이블 형태로 데이터 병합 및 월별 매출 계산
                      const monthlySales = {};
                      orders.forEach((order) => {
                        const month = order.OrderAt.substring(0, 7); // "YYYY-MM"
                        const orderItemsForOrder = orderItems.filter(
                          (oi) => oi.OrderId === order.Id
                        );

                        if (!monthlySales[month]) {
                          monthlySales[month] = {
                            TotalRevenue: 0,
                            ItemCount: 0,
                          };
                        }

                        orderItemsForOrder.forEach(() => {
                          // 수량을 기본적으로 1로 가정하고 계산
                          console.log(
                            `Using default Quantity of 1 for item calculations. Item UnitPrice: ${item.UnitPrice}`
                          );

                          if (typeof item.UnitPrice === "number") {
                            monthlySales[month].TotalRevenue += item.UnitPrice; // Quantity를 1로 가정
                            monthlySales[month].ItemCount += 1;
                          }
                        });
                      });

                      // 월간 매출 데이터를 배열 형식으로 변환
                      const monthlySalesArray = Object.keys(monthlySales)
                        .map((month) => ({
                          Month: month,
                          TotalRevenue: monthlySales[month].TotalRevenue,
                          ItemCount: monthlySales[month].ItemCount,
                        }))
                        .sort((a, b) => a.Month.localeCompare(b.Month));

                      console.log(
                        "Monthly sales calculated successfully:",
                        monthlySalesArray
                      );
                      // 아이템 정보와 월간 매출 데이터 반환
                      res.json({ item, monthlySales: monthlySalesArray });
                    }
                  }
                );
              }
            }
          }
        );
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = itemRoutes;
