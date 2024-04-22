import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlorder.module.scss'
import { QLORDER_API } from '../constants'

function Qlorder({isrender}) {
    console.log('re-render-qlorder')
    const [qlOrders,setQlOrders] = useState([])
    const [qlOrdersSearch,setQlOrderSearch] = useState([])
    const [qlOrder,setQlOrder] = useState('')

    useEffect(() => {
        axios.get(QLORDER_API)
            .then(res => {
                setQlOrders(res.data);
                setQlOrderSearch(res.data);
            })
            .catch(error => {
                console.error('Error fetching qlorder:', error);
            });
    }, [])

    useEffect(() => {
        setQlOrderSearch(qlOrder ? qlOrders.filter(item => item.tableId.includes(qlOrder)) : qlOrders);
    }, [qlOrder])

    const classQlorderSearch = clsx(style.qlorderSearch, 'input-group')
    const classQlorderButton = clsx(style.qlorderButton, 'btn btn-outline-primary')
    const classQlorderIcon = clsx(style.qlorderIcon)
    const classQlorderTable = clsx(style.qlorderTable, 'table')
    const classQlorderColId = clsx(style.qlorderCol, 'col-1')
    const classQlorderColName = clsx(style.qlorderCol, 'col-1')
    const classQlorderCol = clsx(style.qlorderCol, 'col-2')

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
                        <th className={classQlorderColId}>#</th>
                        <th className={classQlorderColName}>Bàn</th>
                        <th className={classQlorderCol}>Thời gian gửi</th>
                        <th className={classQlorderCol}>Khách hàng</th>
                        <th className={classQlorderCol}>Tình trạng</th>
                        <th className={classQlorderCol}>Thời gian thanh toán</th>
                        <th className={classQlorderCol}>Nhân viên</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        qlOrdersSearch?.map((item, index) => {
                            return (
                                <tr key={item.orderId}>
                                    <th className={classQlorderColId}>{index + 1}</th>
                                    <td className={classQlorderColName}>{item.tableId}</td>
                                    <td className={classQlorderCol}>{item.creationTime}</td>
                                    <td className={classQlorderCol}>{item.customers}</td>
                                    <td className={classQlorderCol}>{item.statusId}</td>
                                    <td className={classQlorderCol}>{item.paymentTime}</td>
                                    <td className={classQlorderCol}>{item.employeeId}</td>
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