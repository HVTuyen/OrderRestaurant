import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlbill.module.scss'
import { QLBILL_API } from '../constants'

function Qlbill({isrender}) {
    console.log('re-render-qlbill')
    const [qlBills,setQlBills] = useState([])
    const [qlBillsSearch,setQlBillSearch] = useState([])
    const [qlBill,setQlBill] = useState('')

    useEffect(() => {
        axios.get(QLBILL_API)
            .then(res => {
                setQlBills(res.data);
                setQlBillSearch(res.data);
            })
            .catch(error => {
                console.error('Error fetching qlBill:', error);
            });
    }, [])

    useEffect(() => {
        setQlBillSearch(qlBill ? qlBills.filter(item => item.tableId.includes(qlBill)) : qlBills);
    }, [qlBill])

    const classQlbillSearch = clsx(style.qlbillSearch, 'input-group')
    const classQlbillButton = clsx(style.qlbillButton, 'btn btn-outline-primary')
    const classQlbillIcon = clsx(style.qlbillIcon)
    const classQlbillTable = clsx(style.qlbillTable, 'table')
    const classQlbillColId = clsx(style.qlbillCol, 'col-1')
    const classQlbillColName = clsx(style.qlbillCol, 'col-1')
    const classQlbillCol = clsx(style.qlbillCol, 'col-2')

    return (
        <div className="col-10">
            <div className='title'>Danh sách loại món ăn</div>
            <div className={classQlbillSearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm..." 
                    value={qlBill}
                    onChange={e => setQlBill(e.target.value)}
                />
                <button className={classQlbillButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classQlbillIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classQlbillButton} to='/Category/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classQlbillIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classQlbillTable}>
                <thead>
                    <tr>
                        <th className={classQlbillColId}>#</th>
                        <th className={classQlbillColName}>Bàn</th>
                        <th className={classQlbillCol}>Thời gian gửi</th>
                        <th className={classQlbillCol}>Khách hàng</th>
                        <th className={classQlbillCol}>Tình trạng</th>
                        <th className={classQlbillCol}>Thời gian thanh toán</th>
                        <th className={classQlbillCol}>Nhân viên</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        qlBillsSearch?.map((item, index) => {
                            return (
                                <tr key={item.BillId}>
                                    <th className={classQlbillColId}>{index + 1}</th>
                                    <td className={classQlbillColName}>{item.tableId}</td>
                                    <td className={classQlbillCol}>{item.creationTime}</td>
                                    <td className={classQlbillCol}>{item.customers}</td>
                                    <td className={classQlbillCol}>{item.statusId}</td>
                                    <td className={classQlbillCol}>{item.paymentTime}</td>
                                    <td className={classQlbillCol}>{item.employeeId}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}


export default Qlbill;