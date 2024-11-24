import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items/${itemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
        const data = await response.json();

        // 디버그 로그 추가
        console.log("Fetched item data:", data);

        setItem(data.item);
        setMonthlySales(data.monthlySales);

        // 디버그 로그 추가
        console.log("Monthly sales data:", data.monthlySales);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // 월간 매출 데이터가 없는 경우 처리
  if (!monthlySales || monthlySales.length === 0) {
    return <div>No monthly sales data available</div>;
  }

  // 차트 데이터 설정
  const chartData = {
    labels: monthlySales.map((sale) => sale.Month),
    datasets: [
      {
        type: "line",
        label: "Total Revenue",
        data: monthlySales.map((sale) => sale.TotalRevenue),
        borderColor: "blue",
        backgroundColor: "blue",
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "Item Count",
        data: monthlySales.map((sale) => sale.ItemCount),
        backgroundColor: "orange",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "월별 매출액 그래프",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "매출액",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "아이템 개수",
        },
        grid: {
          drawOnChartArea: false, // 두 번째 y축의 격자선을 그리지 않음
        },
      },
    },
  };

  return (
    <div>
      {item && (
        <>
          <h1>{item.Name}</h1>
          <p>Unit Price: {item.UnitPrice}</p>
          {/* 추가적인 아이템 정보를 표시 */}
        </>
      )}

      <h2>월간 매출액</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Revenue</th>
            <th>Item Count</th>
          </tr>
        </thead>
        <tbody>
          {monthlySales.map((sale) => (
            <tr key={sale.Month}>
              <td>{sale.Month}</td>
              <td>{sale.TotalRevenue}</td>
              <td>{sale.ItemCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>월별 매출액 그래프</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ItemDetail;
