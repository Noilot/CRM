const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const userRoutes = express.Router();

// 각 데이터베이스 파일에 대한 연결 설정
let userDb = new sqlite3.Database(
  path.resolve(__dirname, "../database/user.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to user database:", err.message);
    } else {
      console.log("Connected to the user database.");
    }
  }
);

let orderDb = new sqlite3.Database(
  path.resolve(__dirname, "../database/order.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to order database:", err.message);
    } else {
      console.log("Connected to the order database.");
    }
  }
);

let orderItemDb = new sqlite3.Database(
  path.resolve(__dirname, "../database/orderitem.db"),
  (err) => {
    if (err) {
      console.error("Failed to connect to orderitem database:", err.message);
    } else {
      console.log("Connected to the orderitem database.");
    }
  }
);

// 전체 사용자 조회
userRoutes.get("/", (req, res) => {
  const sql = "SELECT * FROM User";
  userDb.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// 사용자 상세 정보 조회
userRoutes.get("/:id", (req, res) => {
  const userId = req.params.id;
  console.log(`Fetching details for user with ID: ${userId}`);

  // 사용자 정보 조회
  const userSql = `SELECT * FROM User WHERE Id = ?`;
  userDb.get(userSql, [userId], (err, user) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).send({ error: err.message });
    }

    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log("User found:", user);

    // 주문 정보 조회
    const orderSql = `SELECT * FROM Orders WHERE UserId = ?`;
    console.log("Fetching orders with query:", orderSql);
    orderDb.all(orderSql, [userId], (err, orders) => {
      if (err) {
        console.error("Error fetching orders:", err.message);
        return res.status(500).send({ error: err.message });
      }

      if (!orders.length) {
        console.log(`No orders found for user with ID ${userId}`);
      } else {
        console.log(`Orders found for user ${userId}:`, orders);
      }

      // 자주 방문한 매장 조회
      const topStoresSql = `SELECT StoreId, COUNT(StoreId) as VisitCount 
                            FROM Orders 
                            WHERE UserId = ? 
                            GROUP BY StoreId 
                            ORDER BY VisitCount DESC 
                            LIMIT 5`;
      console.log("Fetching top stores with query:", topStoresSql);
      orderDb.all(topStoresSql, [userId], (err, topStores) => {
        if (err) {
          console.error("Error fetching top stores:", err.message);
          return res.status(500).send({ error: err.message });
        }

        console.log(`Top stores found for user ${userId}:`, topStores);

        // 자주 구매한 상품 조회 - 변경된 방식
        const orderIds = orders.map((order) => order.Id); // 해당 사용자의 주문 ID 추출

        if (orderIds.length === 0) {
          // 주문이 없는 경우 빈 배열로 응답
          return res.json({ user, orders, topStores, topItems: [] });
        }

        const placeholders = orderIds.map(() => "?").join(","); // 주문 ID를 위한 쿼리 파라미터 생성
        const topItemsSql = `SELECT ItemId, COUNT(ItemId) as PurchaseCount 
                             FROM OrderItem 
                             WHERE OrderId IN (${placeholders}) 
                             GROUP BY ItemId 
                             ORDER BY PurchaseCount DESC 
                             LIMIT 5`;
        console.log("Fetching top items with query:", topItemsSql);

        orderItemDb.all(topItemsSql, orderIds, (err, topItems) => {
          if (err) {
            console.error("Error fetching top items:", err.message);
            return res.status(500).send({ error: err.message });
          }

          console.log(`Top items found for user ${userId}:`, topItems);

          res.json({ user, orders, topStores, topItems });
        });
      });
    });
  });
});

module.exports = userRoutes;
