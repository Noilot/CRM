// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import Header from "./components/Header";
import OrderList from "./pages/OrderList";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/:itemId" element={<ItemDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
