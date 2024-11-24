const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const port = 3000;

app.use(cors());
app.use(express.json());

// 라우터 파일 불러오기
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");

// 라우터 설정
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orderitems", orderItemRoutes);

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
