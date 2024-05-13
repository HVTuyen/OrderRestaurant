import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MoneyReport(Prop) {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const data = [
    {
      name: "07/05/2024",
      Doanhthu: Prop.revenue,
    },
  ];

  const formatTooltip = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatYAxis = (value) => {
    return `${value/1000000} triệu`;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Xóa bộ xử lý sự kiện khi component bị unmounted để tránh memory leak
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>

      <div className="col-xl-12 col-md-12 mb-4 mx-auto">
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <BarChart
                  width={windowWidth*7/10}
                  height={300}
                  data={data}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatYAxis}/>
                  <Tooltip formatter={formatTooltip}/>
                  <Legend />
                  <Bar dataKey="Doanhthu" name="Doanh thu" fill="#8884d8"/>
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
