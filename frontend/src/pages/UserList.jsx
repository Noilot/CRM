import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState(""); // 이름 검색 상태
  const [filterGender, setFilterGender] = useState(""); // 성별 필터 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const USERS_PER_PAGE = 20; // 페이지당 사용자 수

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.data); // 전체 사용자 목록 설정
        setFilteredUsers(data.data); // 필터링된 사용자 목록 초기화
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 검색 및 필터링 기능
  useEffect(() => {
    let filtered = users;

    // 이름으로 필터링
    if (searchName) {
      filtered = filtered.filter((user) =>
        user.Name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // 성별로 필터링
    if (filterGender) {
      filtered = filtered.filter((user) => user.Gender === filterGender);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [searchName, filterGender, users]);

  // 현재 페이지에 해당하는 사용자 목록 가져오기
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

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
      <h1>User List</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          onClick={() => {
            setSearchName("");
            setFilterGender("");
          }}
        >
          Reset
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gender</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Age</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Birthdate
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Address
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.Id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.Name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.Gender}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.Age}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.Birthdate}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.Address}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Link to={`/users/${user.Id}`}>View Details</Link>
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

export default UserList;
