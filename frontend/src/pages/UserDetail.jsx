import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetail = () => {
  const { userId } = useParams(); // URL 파라미터에서 사용자 ID 가져오기
  const [userData, setUserData] = useState(null); // 전체 데이터 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API URL을 하드코딩하여 사용해 보기
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUserData(data); // 전체 데이터를 한번에 저장
        setLoading(false); // 데이터 로드 완료
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [API_URL, userId]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  if (error) {
    return <div>Error: {error}</div>; // 에러 메시지 표시
  }

  if (!userData) {
    return <div>No user data available</div>; // 데이터가 없을 경우
  }

  // 데이터 분해
  const { user, orders, topStores, topItems } = userData;

  return (
    <div>
      {user && (
        <div>
          <h2>
            {user.Name} (ID: {user.Id})
          </h2>
          <p>Gender: {user.Gender}</p>
          <p>Age: {user.Age}</p>
          <p>Birthdate: {user.Birthdate}</p>
          <p>Address: {user.Address}</p>
        </div>
      )}

      <div>
        <h3>Order History</h3>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.Id}>
                Order at {order.OrderAt}, Store ID: {order.StoreId}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      <div>
        <h3>Top 5 Most Visited Stores</h3>
        {topStores.length > 0 ? (
          <ul>
            {topStores.map((store) => (
              <li key={store.StoreId}>
                Store ID: {store.StoreId}, Visit Count: {store.VisitCount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No top stores found.</p>
        )}
      </div>

      <div>
        <h3>Top 5 Most Purchased Items</h3>
        {topItems.length > 0 ? (
          <ul>
            {topItems.map((item) => (
              <li key={item.ItemId}>
                Item ID: {item.ItemId}, Purchase Count: {item.PurchaseCount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No top items found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
