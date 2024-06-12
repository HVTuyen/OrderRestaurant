import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import { QLORDER_API, ORDER_TYPE, CONFIG_API, ORDER_APPROVE_CODE, ORDER_REFUSE_CODE} from '../../constants'
import style from './qlorder.module.scss'
import { db } from '../../../firebaseConfig';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import { decodeJWT } from '../../../Functions/decodeJWT'
import { formatDateTimeSQL } from '../../../Functions/formatDateTime'
import { UpdateOrderDetail } from '../../../CallApi/OrderApi/UpdateOrderDetail'
import { deleteOrderDetail } from '../../../CallApi/OrderApi/deleteOrderDetail'
import { deleteOrder } from '../../../CallApi/OrderApi/deleteOrder';
import ModalDelete from '../../../component/Modal/ModalDelete';
import { approveOrder } from '../../../CallApi/OrderApi/approveOrder'
import { refuseOrder } from '../../../CallApi/OrderApi/refuseOrder'

function QlorderDetail() {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const { id } = useParams()
    console.log(id)

    useEffect(() => {
        if (token) {
            setUser(decodeJWT(token))
        }
    }, [])

    const searchOrder = sessionStorage.getItem('searchOrder')
    const searchStatus = sessionStorage.getItem('searchStatus')
    const startDate = sessionStorage.getItem('searchStartDate');
    const endDate = sessionStorage.getItem('searchEndDate');

    const [user, setUser] = useState(null);
    const [order, setOrder] = useState([])
    const [status, setStatus] = useState([])
    const [total, setTotal] = useState()
    const [quantity, setQuantity] = useState({})
    const [render, setRender] = useState()
    const [isShowModal, setIsShowModal] = useState(false)

    useEffect(() => {
        axios.get(`${QLORDER_API}${id}`)
            .then(res => {
                setTotal(res.data.totalAmount)
                const initialQuantities = {}
                res.data.orderDetails.forEach(item => {
                    initialQuantities[item.foodId] = item.quantity
                })
                setQuantity(initialQuantities);
                setOrder(res.data);
                axios.get(`${CONFIG_API}type?type=${ORDER_TYPE}`)
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

    const handleUpdateQuantity = async (id, foodId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await UpdateOrderDetail(config, id, {
            foodId: foodId,
            quantity: quantity[foodId]
        });
        if (response && response.data) {
            alert('Cập nhật số lượng thành công!')
            setRender(Math.random())
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
                    const newDataResponse = await UpdateOrderDetail(config, id, foodId, { quantity: quantity[foodId] });
                    if (newDataResponse && newDataResponse.data) {
                        alert('Cập nhật số lượng thành công!')
                        setRender(Math.random())
                    } else {
                        console.error(`Error update order detail after token renewal`);
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            }
            if (response && response.error === 'AccessDenied') {
                navigate('/Ql/AccessDenied/')
            }
            else {
                console.error(`Error update order detail`);
            }
        }
    }

    const handleDelete = async (id, foodId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await deleteOrderDetail(config, id, foodId);
        if (response && response.data) {
            alert('Xóa món ăn thành công!')
            setRender(Math.random())
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
                    const newDataResponse = await deleteOrderDetail(newconfig, id, foodId);
                    if (newDataResponse && newDataResponse.data) {
                        alert('Xóa món ăn thành công!')
                        setRender(Math.random())
                    }
                    if (response && response.error === 'AccessDenied') {
                        navigate('/Ql/AccessDenied/')
                    }
                    else {
                        console.error(`Error delete order detail after token renewal`);
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            }
            if (response && response.error === 'AccessDenied') {
                navigate('/Ql/AccessDenied/')
            }
            else {
                console.error(`Error delete order detail`);
            }
        }
    }

    const handleOrderType = async (config, id, CODE) => {
        if (CODE === 2) {
            return approveOrder(config, id, user.id)
        }
        if (CODE === 4) {
            return refuseOrder(config, id, user.id)
        }
    }

    const handleOrder = async (id, tableId, CODE) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await handleOrderType(config, id, CODE);
        if (response && !response.error) {
            const docRef = addDoc(collection(db, "table"), {
                tableId: tableId,
            });
            setRender(Math.random())
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
                    const newDataResponse = await handleOrderType(newconfig, id, CODE);
                    if (newDataResponse) {
                        const docRef = addDoc(collection(db, "table"), {
                            tableId: tableId,
                        });
                        setRender(Math.random())
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

    const acceptDeleteOrder = async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await deleteOrder(config, id);
        if (response && !response.error) {
            navigate(`/Ql/Action/Order?page=1&search=${searchOrder || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
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
                    const newDataResponse = await deleteOrder(newconfig, id);
                    if (newDataResponse) {
                        navigate(`/Ql/Action/Order?page=1&search=${searchOrder || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
                    } else {
                        console.error('Error delete order after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error delete order');
            }
        }
    }

    const handleDeleteOrder = async (id) => {
        setIsShowModal(true)
    }

    const handleModal = (action) => {
        if(!action) {
            setIsShowModal(false)
        }
        else {
            acceptDeleteOrder(id)
            setIsShowModal(false)
        }
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
                <div className='col-8' style={{ borderRadius: '3px', border: '1px solid #333' }}>
                    <div className="mb-3 row" style={{ margin: '24px' }}>
                        <label className="col-sm-3 col-form-label">Bàn Order</label>
                        <label className="col-sm-9 col-form-label">{order?.table?.name}</label>
                    </div>
                    <div className="mb-3 row" style={{ margin: '24px' }}>
                        <label className="col-sm-3 col-form-label">Thời gian Order</label>
                        <label className="col-sm-9 col-form-label">{formatDateTimeSQL(order?.createTime)}</label>
                    </div>
                    <div className="mb-3 row" style={{ margin: '24px' }}>
                        <label className="col-sm-3 col-form-label">Tình trạng</label>
                        <label className="col-sm-5 col-form-label">{getStatusByCode(order?.code)?.value}</label>
                        <div className="col-sm-4 col-form-label d-flex">
                            {order?.code === 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary padding-6 col-6"
                                        style={{ marginRight: '1px' }}
                                        onClick={() => handleOrder(id, order.orderId, ORDER_APPROVE_CODE)}
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger padding-6 col-6"
                                        style={{ marginRight: '1px' }}
                                        onClick={() => handleOrder(id, order.orderId, ORDER_REFUSE_CODE)}
                                    >
                                        Từ chối
                                    </button>
                                </>
                            )}

                            {order?.code === 4 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger padding-6 col-12"
                                    // style={{width:'130px'}}
                                    onClick={() => handleDeleteOrder(id)}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mb-3 row" style={{ margin: '24px' }}>
                        <label className="col-sm-3 col-form-label">Nhân viên phụ trách</label>
                        <label className="col-sm-9 col-form-label">{order?.user?.name}</label>
                    </div>
                </div>
                <div className='col-2 d-flex j-flex-end' style={{ height: '40px', paddingRight: '24px' }}>


                    <button
                        className='btn btn-outline-danger'
                        onClick={() => {
                            navigate(`/Ql/Action/Order?page=1&search=${searchOrder || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
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
                        order?.orderDetails?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th className={classQlorderCol_1}>{index + 1}</th>
                                    <td className={classQlorderCol_2}>
                                        <img src={item.food.urlImage} style={{ width: '100%', height: '100px' }} />
                                    </td>
                                    <td className={classQlorderCol_2}>{item.food.name}</td>
                                    <td className={classQlorderCol_2}>
                                        {
                                            order.code == 1 ? (
                                                <div className='d-flex width-full'>
                                                    <button
                                                        className="btn btn-link px-2"
                                                        style={{ border: '1px solid #ccc' }}
                                                        onClick={() => handleQuantityChange(item.foodId, -1)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} style={{ fontSize: '24px' }} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min='1'
                                                        className="form-control form-control-sm t-center"
                                                        value={quantity[item.foodId]}
                                                        onChange={() => { }}
                                                    />
                                                    <button
                                                        className="btn btn-link px-2"
                                                        style={{ border: '1px solid #ccc' }}
                                                        onClick={() => handleQuantityChange(item.foodId, 1)}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} style={{ fontSize: '24px' }} />
                                                    </button>

                                                    <div style={{ padding: '0 6px' }}>
                                                        <button
                                                            className='btn btn-outline-primary width-full'
                                                            onClick={() => handleUpdateQuantity(id, item.foodId)}
                                                        >
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : item.quantity
                                        }
                                    </td>
                                    <td className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                                    <td className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceTotal)}</td>
                                    <td className={classQlorderCol_1 + ' t-center'}>
                                        {
                                            order.code == 1 && order.orderDetails.length > 1 ? (
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    style={{ color: '#ff5252', fontSize: '28px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(id, item.foodId)}
                                                />
                                            ) : ''
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                <tbody>
                    <tr>
                        <th colSpan='6' className={classQlorderCol_1} style={{ textAlign: 'right' }}>Tổng tiền</th>
                        <th colSpan='1' className={classQlorderCol_2}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</th>
                    </tr>
                </tbody>
            </table>
            {
                isShowModal && (
                    <ModalDelete
                        handleModal={handleModal}
                        title='đơn hàng'
                    />
                )
            }
        </div>
    )
}

export default QlorderDetail;