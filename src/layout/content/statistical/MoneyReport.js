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

  const data = Object.entries(Prop.data).map(([name, value]) => ({
    name: name,
    value: value,
  }));

  const formatTooltip = (value) => {
    let valueformat;
    if (Prop.type === 'money') {
      valueformat = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
    else if (Prop.type === 'food') {
      valueformat = `${value} món`;
    }
    else if (Prop.type === 'order') {
      valueformat = `${value} đơn`;
    }
    return valueformat;
  };

  const formatYAxis = (value) => {
    let valueformat;
    if (Prop.type === 'money') {
      valueformat = `${value / 1000000} triệu`
    }
    else if (Prop.type === 'food') {
      valueformat = value;
    }
    else if (Prop.type === 'order') {
      valueformat = value;
    }
    return valueformat;
  };

  const getColor = () => {
    if (Prop.type === 'money') {
      return "#7f7ccd";
    }
    else if (Prop.type === 'food') {
      return "#75c480";
    }
    else if (Prop.type === 'order') {
      return "#cb858d";
    }
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
      <div className="col-xl-10 col-md-10 mb-4 mx-auto">
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BarChart
                  width={windowWidth * 5 / 10}
                  height={300}
                  data={data}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Bar dataKey="value" name={Prop.type === 'money' ? 'Doanh thu' : Prop.type === 'food' ? 'Món ăn đã bán' : 'Đơn hàng được đặt'} fill={getColor()} />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
