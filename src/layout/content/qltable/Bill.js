import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";

import style from './qltable.module.scss'
import { QLORDER_API, TABLE_API, CONFIG_API, TABLE_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { update } from 'firebase/database';
import {formatDateTime, formatDateTimeSQL} from '../../../Functions/formatDateTime'
import { MyDocument } from '../../../component/exportPDF/MyDocument';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'
import { decodeJWT } from '../../../Functions/decodeJWT'
import { paymentOrder } from '../../../CallApi/OrderApi/paymentOrder'
import { getBill } from '../../../CallApi/OrderApi/getBill'

function Bill( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [order,setOrder] = useState()
    const [table, setTable] = useState()
    const [status,setStatus] = useState()
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            setUser(decodeJWT(token))
        }
    }, [])

    const [showExportFile, setShowExportFile] = useState(true)

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
        const response = await getBill(config, id);
        if (response && response.data) {
            setOrder(response.data)
        } else {
            if (response && response.error === 'Unauthorized') {
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
                    const newDataResponse = await getBill(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setOrder(response.data)
                    } else {
                        console.error('Error fetch order after renewing token');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            }
            if (response && response.error === 'AccessDenied') {
                navigate('/Ql/AccessDenied');
            } else {
                console.error('Error fetching order');
            }
        }
    };

    useEffect(() => {
        if(user) {
            fetchData();
        }
    }, [user])

    useEffect(() => {
        axios.get(`${TABLE_API}${id}`)
            .then(res => {
                setTable(res.data)
            })
            .catch(error => {
                console.error('Error fetching table:', error);
            });
    }, [])

    const handleOrder = async (id, tableId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await paymentOrder(config, id, user.EmployeeId);
        if (response && !response.error) {
            const docRef = addDoc(collection(db, "table"), {
                tableId: tableId,
            });
            navigate('/Ql/Action/Table');
        } else {
            if (response && response.error === 'Unauthorized') {
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
                    const newDataResponse = await paymentOrder(newconfig, id, user.EmployeeId);
                    if (newDataResponse) {
                        const docRef = addDoc(collection(db, "table"), {
                            tableId: tableId,
                        });
                        navigate('/Ql/Action/Table');
                    } else {
                        console.error('Error refuse order after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error refuse order');
            }
        }
    }

    useEffect(() => {
        console.log('re-render 2')
        axios.get(`${CONFIG_API}search?type=${TABLE_TYPE}`)
            .then(res => {
                setStatus(res.data);
            })
            .catch(error => {
                console.error('Error fetching status:', error);
            });
    }, [])

    console.log(order, status)

    const classQltableList = clsx(style.qltableList, 'table table-center')
    const classQltableCol_0_5 = clsx(style.qltableCol, 'col-0-5')
    const classQltableCol_1 = clsx(style.qltableCol, 'col-1')
    const classQltableCol_1_5 = clsx(style.qltableCol, 'col-1-5')
    const classQltableCol_2 = clsx(style.qltableCol, 'col-2')
    const classQltableCol_3 = clsx(style.qltableCol, 'col-3')
    
    return (
        <div className="col-10">
            <div className='title'>Chi tiết hóa đơn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-6 col-form-label">Bàn</label>
                        <label className="col-sm-6 col-form-label">{table?.tableName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-6 col-form-label">Thời gian Order lần cuối</label>
                        <label className="col-sm-6 col-form-label">{formatDateTimeSQL(order?.orders[order?.orders.length - 1].creationTime)}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-6 col-form-label">Nhân viên phụ trách</label>
                        <label className="col-sm-6 col-form-label">{order?.orders[0].employees.employeeName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-6 col-form-label" style={{fontSize:'24px', fontWeight:'700'}}>Tổng tiền</label>
                        <label className="col-sm-6 col-form-label" style={{fontSize:'24px', fontWeight:'700'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.totalAmount)}</label>
                    </div>
                    <div className="d-flex j-space-between" style={{margin: '24px'}}>
                        {
                            showExportFile ? (
                                <PDFDownloadLink 
                                    document={
                                        <MyDocument 
                                            Prop={{
                                                tableName: table?.tableName,
                                                paymentTime: formatDateTime(new Date()),
                                                employeeName: order?.orders[0].employees.employeeName,
                                                totalAmount: order?.totalAmount,
                                                allFoods: order?.allFoods
                                            }}
                                        />
                                    } 
                                    fileName={`Hoa_Don_Ban_${table?.tableName}.pdf`}
                                    className='btn btn-outline-primary'
                                    onClick={() => setShowExportFile(false)}
                                >
                                    {({ blob, url, loading, error }) => (loading ? 'Đang tạo...' : 'Xuất hóa đơn')}
                                </PDFDownloadLink>
                            ) : (
                                <>
                                    <PDFDownloadLink 
                                        document={
                                            <MyDocument 
                                                Prop={{
                                                    tableName: table?.tableName,
                                                    paymentTime: formatDateTime(new Date()),
                                                    employeeName: order?.orders[0].employees.employeeName,
                                                    totalAmount: order?.totalAmount,
                                                    allFoods: order?.allFoods
                                                }}
                                            />
                                        } 
                                        fileName={`Hoa_Don_Ban_${table?.tableName}_${formatDateTime(new Date())}.pdf`}
                                        className='btn btn-outline-primary'
                                        onClick={() => setShowExportFile(false)}
                                    >
                                        {({ blob, url, loading, error }) => (loading ? 'Đang tạo...' : 'Xuất hóa đơn')}
                                    </PDFDownloadLink>
                                    <button 
                                        className='btn btn-outline-primary'
                                        onClick={() => handleOrder(id, order.tableId)}
                                    >
                                        Thanh toán
                                    </button>
                                </>
                            )
                        }
                    </div>
                </div>
                <div className='col-2 d-flex j-flex-end' style={{height:'40px', paddingRight:'24px'}}>
                    
                    
                    <button 
                        className='btn btn-outline-danger'
                        onClick={() => {
                            navigate('/Ql/Action/Table')
                        }}
                    >
                        Trở về
                    </button>
                </div>
            </div>

            <table className={classQltableList}>
                <thead className="table-secondary">
                    <tr>
                        <th className={classQltableCol_1}>#</th>
                        <th className={classQltableCol_1}>Ảnh</th>
                        <th className={classQltableCol_2}>Tên món</th>
                        <th className={classQltableCol_3}>Số lượng</th>
                        <th className={classQltableCol_2}>Đơn giá</th>
                        <th className={classQltableCol_3}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order?.allFoods.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th className={classQltableCol_1}>{index + 1}</th>
                                    <td className={classQltableCol_2}>
                                        <img src={item.urlImage} style={{width: '100%', height: '100px'}} />
                                    </td>
                                    <td className={classQltableCol_2}>{item.nameFood}</td>
                                    <td className={classQltableCol_2}>{item.quantity}</td>
                                    <td className={classQltableCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}</td>
                                    <td className={classQltableCol_3}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Bill;