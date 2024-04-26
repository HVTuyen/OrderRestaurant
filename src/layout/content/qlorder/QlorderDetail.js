import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import { QLORDER_API, ORDER_TYPE, CONFIG_API} from '../../constants'
import style from './qlorder.module.scss'
import {formatDateTimeSQL} from '../../formatDateTime'

function QlorderDetail( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [order,setOrder] = useState([])
    const [status,setStatus] = useState([])
    const [total,setTotal] = useState()
    const [quantity,setQuantity] = useState({})
    const [render,setRender] = useState()

    useEffect(() => {
        axios.get(`${QLORDER_API}get-order-details/${id}`)
            .then(res => {
                setTotal(res.data.reduce((total, index) => {
                    return total + index.totalAmount
                }, 0))
                const initialQuantities = {}
                res.data.forEach(item => {
                    initialQuantities[item.foods.foodId] = item.quantity
                })
                setQuantity(initialQuantities);
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
    }, [render])

    function getStatusByCode(code) {
        return status.find(statusinfo => statusinfo.code === code);
    }

    const handleQuantityChange = (id, change) => {
        setQuantity(prevState => {
            const newQuantity = (prevState[id] || 1) + change;
    
            return {
                ...prevState,
                [id]: newQuantity
            };
        })
    }

    const handleUpdateQuantity = (id, foodId) => {
        axios.put(`${QLORDER_API}UpdateOrderDetail/${id}/${foodId}`, {quantity: quantity[foodId]})
            .then(res => {
                alert('Cập nhật số lượng thành công!')
                setRender(Math.random())
            })
            .catch(error => {
                console.error('Error fetching status:', error);
            });
    }

    const handleDelete = (id, foodId) => {
        axios.delete(`${QLORDER_API}DeleteOrderDetail/${id}/${foodId}`)
        .then(res => {
            alert('Xóa món ăn thành công!')
            setRender(Math.random())
        })
        .catch(error => {
            console.error('Error fetching status:', error);
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
    const classQlorderCol_3 = clsx(style.qlorderCol, 'col-3')

    console.log(order)
    
    return (
        <div className="col-10">
            <div className='title'>Chi tiết đơn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Bàn Order</label>
                        <label className="col-sm-9 col-form-label">{order[0]?.orders?.tables?.tableName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Thời gian Order</label>
                        <label className="col-sm-9 col-form-label">{formatDateTimeSQL(order[0]?.orders?.creationTime)}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tình trạng</label>
                        <label className="col-sm-3 col-form-label">{getStatusByCode(order[0]?.orders?.code)?.value}</label>
                        <label className="col-sm-3 col-form-label">Nhân viên phụ trách</label>
                        <label className="col-sm-3 col-form-label">{order[0]?.orders?.employees?.employeeName}</label>
                    </div>
                </div>
                <div className='col-2 d-flex j-flex-end' style={{height:'40px', paddingRight:'24px'}}>
                    <button 
                        className='btn btn-outline-danger'
                        onClick={() => {
                            navigate('/Ql/Action/Order')
                        }}
                    >
                        Trở về
                    </button>
                </div>
            </div>

            <table className={classQlorderTable}>
                <thead className="table-secondary">
                    <tr>
                        <th className={classQlorderCol_1}>#</th>
                        <th className={classQlorderCol_1}>Ảnh</th>
                        <th className={classQlorderCol_2}>Tên món</th>
                        <th className={classQlorderCol_3}>Số lượng</th>
                        <th className={classQlorderCol_2}>Đơn giá</th>
                        <th className={classQlorderCol_2}>Thành tiền</th>
                        <th className={classQlorderCol_1}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th className={classQlorderCol_1}>{index + 1}</th>
                                    <td className={classQlorderCol_2}>
                                        <img src={item.foods.urlImage} style={{width: '100%', height: '100px'}} />
                                    </td>
                                    <td className={classQlorderCol_2}>{item.foods.nameFood}</td>
                                    <td className={classQlorderCol_2}>
                                        <div className='d-flex width-full'>
                                            <button
                                                className="btn btn-link px-2"
                                                style={{border: '1px solid #ccc'}}
                                                onClick={() => handleQuantityChange(item.foodId, -1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} style={{fontSize:'24px'}}/>
                                            </button>
                                            <input
                                                type="number"
                                                min='1'
                                                className="form-control form-control-sm t-center" 
                                                value={quantity[item.foods.foodId]}
                                                onChange={() => {}}
                                            />
                                            <button 
                                                className="btn btn-link px-2"
                                                style={{border: '1px solid #ccc'}}
                                                onClick={() => handleQuantityChange(item.foodId, 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} style={{fontSize:'24px'}}/>
                                            </button>
                                            
                                            <div style={{padding:'0 6px'}}>
                                                <button 
                                                    className='btn btn-outline-primary width-full'
                                                    onClick={() => handleUpdateQuantity(id, item.foods.foodId)}
                                                >
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.foods.unitPrice)}</td>
                                    <td className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}</td>
                                    <td className={classQlorderCol_1 + ' t-center'}>
                                        <FontAwesomeIcon 
                                            icon={faTrash} 
                                            style={{color:'#ff5252', fontSize:'28px'}}
                                            onClick={() => handleDelete(id, item.foods.foodId)}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                <tbody>
                    <tr>
                        <th colSpan='6' className={classQlorderCol_1} style={{textAlign:'right'}}>Tổng tiền</th>
                        <th colSpan='1' className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default QlorderDetail;