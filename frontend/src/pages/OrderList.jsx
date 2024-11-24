import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const ORDERS_PER_PAGE = 20; // 페이지당 주문 수

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.data); // 전체 주문 목록 설정
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 현재 페이지에 해당하는 주문 목록 가져오기
  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Order List</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Order ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Order Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Store ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              User ID
            </th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.Id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.Id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.OrderAt}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.StoreId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.UserId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
            style={{ margin: "0 5px" }}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderList;
