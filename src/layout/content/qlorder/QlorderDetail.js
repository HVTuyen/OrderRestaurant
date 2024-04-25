import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { QLORDER_API, ORDER_TYPE, CONFIG_API} from '../../constants'

function QlorderDetail( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [order,setOrder] = useState('')
    const [status,setStatus] = useState([])
    const [statusSelect,setStatusSelect] = useState('')

    useEffect(() => {
        axios.get(`${QLORDER_API}get-order-details/${id}`)
            .then(res => {
                setOrder(res.data);
                axios.get(`${CONFIG_API}search?type=${ORDER_TYPE}`)
                    .then(res => {
                        setStatus(res.data);
                    })
                    .catch(error => {
                        console.error('Error fetching status:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching order:', error);
            });
    }, [])

    console.log(order)
    
    return (
        <div className="col-10">
            <div className='title'>Chi tiết đơn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên món ăn</label>
                        <label className="col-sm-9 col-form-label">{order.orderId}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Giá</label>
                        <label className="col-sm-9 col-form-label">{order.tables?.tableName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <label className="col-sm-9 col-form-label">{order.tables?.tableName}</label>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default QlorderDetail;