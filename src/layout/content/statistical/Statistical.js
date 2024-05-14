import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Link, useNavigate} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { formatDateTimeSearch } from "../../../Functions/formatDateTime";
import MoneyReport from './MoneyReport'
import { useAuth } from '../../../component/Context/AuthProvider';
import { decodeJWT } from '../../../Functions/decodeJWT'
import { renewToken} from '../../../CallApi/renewToken'
import { getRevenue } from '../../../CallApi/StatisticalApi/getRevenue'

const Statistical = () => {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [startDate, setStartDate] = useState(formatDateTimeSearch(new Date()));
    const [endDate, setEndDate] = useState(formatDateTimeSearch(new Date()));

    const [TotalRevenue, setTotalRevenue] = useState(0)
    const [dataRevenue, setDataRevenue] = useState({})
    const [totalFood, setTotalFood] = useState(0)
    const [dataFood, setDataFood] = useState({})
    const [totalOrder, setTotalOrder] = useState(0)
    const [dataOrder, setDataOrder] = useState({})
    
    const [showRevenue, setShowRevenue] = useState(false)
    const [showFood, setShowFood] = useState(false)
    const [showOrder, setShowOrder] = useState(false)

    const handleGetSatistical = () => {
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const date = {
                startDate: startDate,
                endDate: endDate
            };
            const response = await getRevenue(config, date);
            if (response && response.data) {
                setTotalRevenue(response.data.totalRevenue);
                setDataRevenue(response.data.doanhSo)
                setTotalFood(response.data.food.totalFood);
                setDataFood(response.data.dayFood);
                setTotalOrder(response.data.totalOrder);
                setDataOrder(response.data.donHang)
            } else if (response && response.error === 'Unauthorized') {
                try {
                    const { accessToken, refreshToken } = await renewToken(oldtoken, navigate);
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    reNewToken(accessToken, refreshToken);
                    const newconfig = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    const newDataResponse = await getRevenue(newconfig, date);
                    if (newDataResponse && newDataResponse.data) {
                        setTotalRevenue(response.data.totalRevenue);
                        setDataRevenue(response.data.doanhSo)
                        setTotalFood(response.data.food.totalFood);
                        setDataFood(response.data.dayFood);
                        setTotalOrder(response.data.totalOrder);
                        setDataOrder(response.data.donHang)
                    } else {
                        console.error('Error fetching revenue after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                if(response.error === 'Date') {
                    alert('Ngày bắt đầu phải trước ngày kết thúc thống kê!')
                }
            }
        };
        fetchData();
    }

    console.log(TotalRevenue)
    console.log(startDate)

    useEffect(() => {
        handleGetSatistical();
    }, [])

    return (
        <div className="col-10">
            <div className="divider d-flex align-items-center my-3">
                <h2 className="text-center fw-bold mx-2 mb-0">Báo cáo tổng quan</h2>
            </div>

            <div className="row j-center">
                <div className="col-9">
                    <div className="card">
                        <div className="card-body" style={{padding:'0'}}>
                            <div className="d-flex justify-content-between p-md-1">
                                <div className="d-flex flex-row">
                                    <div className="d-flex align-self-center text-center">
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <h5 style={{ margin: "10px" }}>Date</h5>
                                                <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy"/>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <h5 style={{ margin: "10px" }}>-</h5>
                                                <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="align-self-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-outline-primary"
                                        onClick={(handleGetSatistical)}
                                    >
                                        Xem
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginTop: "4vh" }}>
                <div className="col-xl-4 col-md-12 mb-2">
                    <div className="card">
                        <div className="card-body" style={{padding:'6px'}}>
                            <div className="d-flex justify-content-between p-md-1">
                                <div className="d-flex flex-row">
                                    <div>
                                        <h4>Tổng doanh thu</h4>
                                        <h3 className="h1 mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(TotalRevenue)}</h3>
                                        
                                    </div>
                                </div>
                                <div className="align-self-center">
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => setShowRevenue(!showRevenue)}
                                    >
                                        {
                                            showRevenue ? 'Ẩn' : 'Chi tiết'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-12 mb-2">
                    <div className="card">
                        <div className="card-body" style={{padding:'6px'}}>
                            <div className="d-flex justify-content-between p-md-1">
                                <div className="d-flex flex-row">
                                    <div>
                                        <h4>Tổng số món ăn đã bán</h4>
                                        <h3 className="h1 mb-0">{totalFood}</h3>
                                        
                                    </div>
                                </div>
                                <div className="align-self-center">
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => setShowFood(!showFood)}
                                    >
                                        {
                                            showFood ? 'Ẩn' : 'Chi tiết'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-12 mb-2">
                    <div className="card">
                        <div className="card-body" style={{padding:'6px'}}>
                            <div className="d-flex justify-content-between p-md-1">
                                <div className="d-flex flex-row">
                                    <div>
                                        <h4>Tổng số đơn</h4>
                                        <h3 className="h1 mb-0">{totalOrder}</h3>
                                        
                                    </div>
                                </div>
                                <div className="align-self-center">
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => setShowOrder(!showOrder)}
                                    >
                                        {
                                            showOrder ? 'Ẩn' : 'Chi tiết'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                showRevenue ? (
                    <MoneyReport 
                        type='money'
                        data={dataRevenue}
                    />
                ) : null
            }
            {
                showFood ? (
                    <MoneyReport 
                        type='food'
                        data={dataFood}
                    />
                ) : null
            }
            {
                showOrder ? (
                    <MoneyReport 
                        type='order'
                        data={dataOrder}
                    />
                ) : null
            }
        </div>
    );
};

export default Statistical;