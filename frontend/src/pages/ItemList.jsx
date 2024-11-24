import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const ITEMS_PER_PAGE = 20; // 페이지당 아이템 수

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.data); // 전체 아이템 목록 설정
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 현재 페이지에 해당하는 아이템 목록 가져오기
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

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
      <h1>Item List</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Item ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Item Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Unit Price
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.Id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.Id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.Name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.UnitPrice}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link to={`/items/${item.Id}`}>View Details</Link>
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

export default ItemList;
