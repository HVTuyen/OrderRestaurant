import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlorder.module.scss'
import { QLORDER_API } from '../../constants'
import {formatDateTime} from '../../formatDateTime'
import { db } from '../../../firebaseConfig';

function Qlorder({isrender}) {
    console.log('re-render-qlorder')
    const [qlOrders,setQlOrders] = useState([])
    const [qlOrdersSearch,setQlOrderSearch] = useState([])
    const [qlOrder,setQlOrder] = useState('')
    const [render, setRender] = useState({})

    useEffect(() => {
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
        setQlOrderSearch(qlOrder ? qlOrders.filter(item => item.tableId.includes(qlOrder)) : qlOrders);
    }, [qlOrder])

    const classQlorderSearch = clsx(style.qlorderSearch, 'input-group')
    const classQlorderButton = clsx(style.qlorderButton, 'btn btn-outline-primary')
    const classQlorderIcon = clsx(style.qlorderIcon)
    const classQlorderTable = clsx(style.qlorderTable, 'table')
    const classQlorderCol_1 = clsx(style.qlorderCol, 'col-1')
    const classQlorderCol_2 = clsx(style.qlorderCol, 'col-2')

    const ordersRef = collection(db, "orders");

    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("New order added: ", change.doc.data());
                    if(change.doc.data()) {
                        setRender(change.doc.data())
                    }
                }
            });
        }, (error) => {
            console.error("Error getting orders:", error);
        });
    }, [])

    return (
        <div className="col-10">
            <div className='title'>Danh sách loại món ăn</div>
            <div className={classQlorderSearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm..." 
                    value={qlOrder}
                    onChange={e => setQlOrder(e.target.value)}
                />
                <button className={classQlorderButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classQlorderIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classQlorderButton} to='/Category/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classQlorderIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classQlorderTable}>
                <thead>
                    <tr>
                        <th className={classQlorderCol_1}>#</th>
                        <th className={classQlorderCol_1}>Bàn</th>
                        <th className={classQlorderCol_2}>Thời gian gửi</th>
                        <th className={classQlorderCol_2}>Khách hàng</th>
                        <th className={classQlorderCol_1}>Tình trạng</th>
                        <th className={classQlorderCol_2}>Thời gian thanh toán</th>
                        <th className={classQlorderCol_2}>Nhân viên</th>
                        <th className={classQlorderCol_1}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        qlOrdersSearch?.map((item, index) => {
                            return (
                                <tr key={item.orderId}>
                                    <th className={classQlorderCol_1}>{index + 1}</th>
                                    <td className={classQlorderCol_1}>{item.tableId}</td>
                                    <td className={classQlorderCol_2}>{formatDateTime(item.creationTime)}</td>
                                    <td className={classQlorderCol_2}>{item.customers}</td>
                                    <td className={classQlorderCol_1}>{item.statusId}</td>
                                    <td className={classQlorderCol_2}>{item.paymentTime}</td>
                                    <td className={classQlorderCol_2}>{item.employeeId}</td>
                                    <td className={classQlorderCol_1}>
                                        <a href='/'>Xem chi tiết</a>
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