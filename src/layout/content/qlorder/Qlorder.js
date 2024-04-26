import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlorder.module.scss'
import { QLORDER_API, CONFIG_API, ORDER_TYPE, ORDER_APPROVE_CODE, ORDER_REFUSE_CODE, ORDER_PAYMENT_CODE,ORDER_APPROVE_SUB,ORDER_PAYMENT_SUB,ORDER_REFUSE_SUB } from '../../constants'
import {formatDateTimeSQL} from '../../formatDateTime'
import { db } from '../../../firebaseConfig';

function Qlorder({isrender}) {
    console.log('re-render-qlorder')
    const [qlOrders,setQlOrders] = useState([])
    const [qlOrdersSearch,setQlOrderSearch] = useState([])
    const [qlOrder,setQlOrder] = useState('')
    const [status,setStatus] = useState([])
    const [statusSelect,setStatusSelect] = useState('')
    const [isRender, setIsRender] = useState('');
    const [showAlert,setShowAlert] = useState(true)
    const [render, setRender] = useState(0)

    useEffect(() => {
        if(render > 1) {
            alert('Có đơn hàng mới!')
        }
        axios.get(`${QLORDER_API}get-order-all`)
        .then(res => {
            setQlOrders(res.data);
            setQlOrderSearch(res.data);
        })
        .catch(error => {
            console.error('Error fetching qlorder:', error);
        });
    }, [render])

    useEffect(() => {
        console.log('re-render 2')
        axios.get(`${CONFIG_API}search?type=${ORDER_TYPE}`)
            .then(res => {
                setStatus(res.data);
            })
            .catch(error => {
                console.error('Error fetching status:', error);
            });
    }, [render])

    useEffect(() => {
        let filteredOrders = qlOrders;
    
        if (qlOrder && statusSelect) {
            filteredOrders = qlOrders.filter(item => item.tables.tableName.includes(qlOrder) && item.code == statusSelect);
        } else if (qlOrder) {
            filteredOrders = qlOrders.filter(item => item.tables.tableName.includes(qlOrder));
        } else if (statusSelect) {
            filteredOrders = qlOrders.filter(item => item.code == statusSelect);
        }
        setQlOrderSearch(filteredOrders);
    }, [qlOrder, statusSelect, isRender]);

    const ordersRef = collection(db, "orders");

    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("orders: ", change.doc.data());
                }
            });
                setRender(prevCount => prevCount + 1);
        }, (error) => {
            console.error("Error getting orders:", error);
        });
    
        return () => unsub(); // Dọn dẹp listener khi component unmount
    }, []);
    
    function getStatusByCode(code) {
        return status.find(statusinfo => statusinfo.code === code);
    }

    const handleOrder = (id, CODE, SUB) => {
        axios.post(`${QLORDER_API}${SUB}/${id}/1`)
        .then(res => {
            axios.get(`${QLORDER_API}get-order-all`)
            .then(res => {
                setQlOrders(res.data);
                setIsRender(Math.random())
            })
            .catch(error => {
                console.error('Error fetching qlorder:', error);
            });
        })
        .catch(error => {
            console.error('Error accept:', error);
        });
    }

    const handleDeleteOrder = (id) => {
        axios.delete(`${QLORDER_API}${id}`)
        .then(res => {
            axios.get(`${QLORDER_API}get-order-all`)
            .then(res => {
                setQlOrders(res.data);
                setIsRender(Math.random())
            })
            .catch(error => {
                console.error('Error fetching qlorder:', error);
            });
        })
        .catch(error => {
            console.error('Error accept:', error);
        });
    }

    const classQlorderSearch = clsx(style.qlorderSearch, 'input-group')
    const classQlorderButton = clsx(style.qlorderButton, 'btn btn-outline-primary')
    const classQlorderIcon = clsx(style.qlorderIcon)
    const classQlorderTable = clsx(style.qlorderTable, 'table table-center')
    const classQlorderCol_0_5 = clsx(style.qlorderCol, 'col-0-5')
    const classQlorderCol_1 = clsx(style.qlorderCol, 'col-1')
    const classQlorderCol_1_5 = clsx(style.qlorderCol, 'col-1-5')
    const classQlorderCol_2 = clsx(style.qlorderCol, 'col-2')
    const classQlorderColHeader = clsx(style.qlorderCol, 'primary')


    console.table(render)
    console.table(qlOrdersSearch)
    console.log(status)
    console.log(qlOrder)

    return (
        <div className="col-10">
            <div className='title'>Danh sách đơn hàng</div>
            <div className={classQlorderSearch}>
                <select
                    style={{maxWidth: '180px'}}
                    className="form-select"
                    value={statusSelect}
                    onChange={e => {
                        setStatusSelect(e.target.value)
                    }}
                >
                    <option value="">--Trạng thái đơn--</option>
                    {status.map(status => (
                        <option key={status.code} value={status.code}>{status.value}</option>
                    ))}
                </select>
                <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..." 
                    value={qlOrder}
                    onChange={e => {
                        setQlOrder(e.target.value)
                    }}
                />
                <button className={classQlorderButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classQlorderIcon} style={{width: '100%'}}/>
                </button>
            </div>

            <table className={classQlorderTable}>
                <thead className="table-secondary">
                    <tr>
                        <th className={classQlorderCol_0_5}>#</th>
                        <th className={classQlorderCol_1}>Bàn</th>
                        <th className={classQlorderCol_1_5}>Thời gian gửi</th>
                        <th className={classQlorderCol_1_5}>Khách hàng</th>
                        <th className={classQlorderCol_1_5}>Tình trạng</th>
                        <th className={classQlorderCol_2}>Thời gian thanh toán</th>
                        <th className={classQlorderCol_1_5}>Nhân viên phụ trách</th>
                        <th className={classQlorderCol_1_5} style={{width:'100%'}}>Xử lý</th>
                        <th className={classQlorderCol_1}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        qlOrdersSearch?.map((item, index) => {
                            return (
                                <tr key={item.orderId}>
                                    <th className={classQlorderCol_0_5}>{index + 1}</th>
                                    <td className={classQlorderCol_1}>{item.tables.tableName}</td>
                                    <td className={classQlorderCol_1_5}>{formatDateTimeSQL(item.creationTime)}</td>
                                    <td className={classQlorderCol_1_5}>{item.customers}</td>
                                    <td className={classQlorderCol_1_5}>{getStatusByCode(item.code)?.value}</td>
                                    <td className={classQlorderCol_2}>{item.paymentTime?formatDateTimeSQL(item.paymentTime):''}</td>
                                    <td className={classQlorderCol_1_5}>{item.employees?.employeeName}</td>
                                    <td className={classQlorderCol_1_5 + ' t-center'} style={{width:'100%'}}>
                                        <div className="btn-group" role="group" aria-label="Basic outlined example" style={{width:'100%'}}>
                                            {item.code === 1 && (
                                                <>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-primary padding-6"
                                                        style={{marginRight:'1px', width:'50%'}}
                                                        onClick={() => handleOrder(item.orderId, ORDER_APPROVE_CODE, ORDER_APPROVE_SUB)}
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-danger padding-6"
                                                        onClick={() => handleOrder(item.orderId, ORDER_REFUSE_CODE, ORDER_REFUSE_SUB)}
                                                    >
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}

                                            {item.code === 2 && (
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-success padding-6"
                                                    // style={{width:'130px'}}
                                                    onClick={() => handleOrder(item.orderId, ORDER_PAYMENT_CODE, ORDER_PAYMENT_SUB)}
                                                >
                                                    Đã thanh toán
                                                </button>
                                            )}

                                            {item.code === 4 && (
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger padding-6"
                                                    // style={{width:'130px'}}
                                                    onClick={() => handleDeleteOrder(item.orderId)}
                                                >
                                                    Xóa
                                                </button>
                                            )}

                                            {item.code === 3 && (
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-info padding-6"
                                                    // style={{width:'130px'}}
                                                    onClick={() => handleDeleteOrder(item.orderId)}
                                                >
                                                    Xuất hóa đơn
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className={classQlorderCol_1 +' t-center'}>
                                        <Link to={`/Ql/Action/Order/${item.orderId}`}>Chi tiết...</Link>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}


export default Qlorder;