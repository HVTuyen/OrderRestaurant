import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlorder.module.scss'
import { QLORDER_API, CONFIG_API, ORDER_TYPE, ORDER_APPROVE_CODE, ORDER_REFUSE_CODE, ORDER_APPROVE_SUB, ORDER_REFUSE_SUB } from '../../constants'
import { formatDateTimeSQL } from '../../../Functions/formatDateTime'
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../component/Context/AuthProvider';
import { decodeJWT } from '../../../Functions/decodeJWT'
import Pagination from '../../../component/Pagination/Pagination'
import { getOrder } from '../../../CallApi/OrderApi/GetOrder';

function Qlorder({ activeMenu }) {
    console.log('re-render-qlorder')

    useEffect(() => {
        sessionStorage.setItem('activeMenu', 'order');
        activeMenu('order')
    }, [])

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    console.log(page)

    const handleChange = (e) => {
        sessionStorage.setItem('searchOrder', e.target.value)
        setQlOrder(e.target.value)
    }

    const { token } = useAuth();
    const [qlOrdersSearch, setQlOrderSearch] = useState([])
    const [qlOrder, setQlOrder] = useState(search || '')
    const [status, setStatus] = useState([])
    const [statusSelect, setStatusSelect] = useState('')
    const [render, setRender] = useState(0)
    const [user, setUser] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (token) {
            setUser(decodeJWT(token))
        }
    }, [])

    console.log(user)

    const fetchData = async () => {
        let data
        if (search?.length > 0) {
            data = {
                Search: search,
                PageNumber: page,
                PageSize: pageSize
            }
        } else {
            data = {
                PageNumber: page,
                PageSize: pageSize
            }
        }
        const response = await getOrder(data);
        if (response && response.data) {
            setQlOrderSearch(response.data.orders);
            setTotalPages(response.data.totalPages)
        } else {
            setQlOrderSearch([])
            setTotalPages(0)
        }
    }

    useEffect(() => {
        console.log(search)
        fetchData();
    }, [render, page, search])

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

    const ordersRef = collection(db, "orders");
    const tableRef = collection(db, "table");

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

    const handleOrder = (id, tableId, CODE, SUB) => {
        axios.post(`${QLORDER_API}${SUB}/${id}/${user.EmployeeId}`)
            .then(res => {
                const docRef = addDoc(collection(db, "table"), {
                    tableId: tableId,
                });
                fetchData()
            })
            .catch(error => {
                console.error('Error accept:', error);
            });
    }

    const handleDeleteOrder = (id) => {
        axios.delete(`${QLORDER_API}${id}`)
            .then(res => {
                fetchData()
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


    console.table(render)
    console.table(qlOrdersSearch)
    console.log(status)
    console.log(qlOrder)

    return (
        <div className="col-10">
            <div className='title'>Danh sách đơn hàng</div>
            <div className={classQlorderSearch}>
                <select
                    style={{ maxWidth: '180px' }}
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
                <select
                    style={{ maxWidth: '180px' }}
                    className="form-select"
                    value={statusSelect}
                    onChange={e => {
                        setStatusSelect(e.target.value)
                    }}
                >
                    <option value="">--Thời gian--</option>
                    {status.map(status => (
                        <option key={status.code} value={status.code}>{status.value}</option>
                    ))}
                </select>
                <select
                    style={{ maxWidth: '180px' }}
                    className="form-select"
                    value={statusSelect}
                    onChange={e => {
                        setStatusSelect(e.target.value)
                    }}
                >
                    <option value="">--Tổng tiền--</option>
                    {status.map(status => (
                        <option key={status.code} value={status.code}>{status.value}</option>
                    ))}
                </select>
                <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..."
                    value={qlOrder}
                    onChange={(e) => handleChange(e)}
                />
                <Link className={classQlorderButton}
                    to={`/Ql/Action/Order?page=1&search=${qlOrder}`}
                >
                    <FontAwesomeIcon icon={faSearch} className={classQlorderIcon} style={{ width: '100%' }} />
                </Link>
            </div>

            {
                qlOrdersSearch ? (
                    <>
                        <table className={classQlorderTable}>
                            <thead className="table-secondary">
                                <tr>
                                    <th className={classQlorderCol_0_5}>#</th>
                                    <th className={classQlorderCol_1}>Bàn</th>
                                    <th className={classQlorderCol_2}>Thời gian gửi</th>
                                    <th className={classQlorderCol_1_5}>Tình trạng</th>
                                    <th className={classQlorderCol_2}>Thời gian thanh toán</th>
                                    <th className={classQlorderCol_2}>Nhân viên phụ trách</th>
                                    <th className={classQlorderCol_2}>Xử lý</th>
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
                                                <td className={classQlorderCol_2}>{formatDateTimeSQL(item.creationTime)}</td>
                                                <td className={classQlorderCol_1_5}>{getStatusByCode(item.code)?.value}</td>
                                                <td className={classQlorderCol_2}>{item.paymentTime ? formatDateTimeSQL(item.paymentTime) : ''}</td>
                                                <td className={classQlorderCol_2}>{item.employees?.employeeName}</td>
                                                <td className={classQlorderCol_2 + ' t-center'}>
                                                    <div className="btn-group" role="group" aria-label="Basic outlined example" style={{ width: '100%' }}>
                                                        {item.code === 1 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary padding-6"
                                                                    style={{ marginRight: '1px', width: '50%' }}
                                                                    onClick={() => handleOrder(item.orderId, item.tableId, ORDER_APPROVE_CODE, ORDER_APPROVE_SUB)}
                                                                >
                                                                    Duyệt
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger padding-6"
                                                                    style={{ width: '50%' }}
                                                                    onClick={() => handleOrder(item.orderId, item.tableId, ORDER_REFUSE_CODE, ORDER_REFUSE_SUB)}
                                                                >
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}

                                                        {item.code === 4 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger padding-6"
                                                                style={{ width: '130px' }}
                                                                onClick={() => handleDeleteOrder(item.orderId)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className={classQlorderCol_1 + ' t-center'}>
                                                    <Link to={`/Ql/Action/Order/${item.orderId}`}>Chi tiết...</Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={page}
                            search={search}
                        />
                    </>
                ) : (
                    <div className='d-flex j-center' style={{ fontSize: '24px', margin: '12px' }}>
                        Không tìm thấy kết quả!
                    </div>
                )
            }
        </div>
    )
}


export default Qlorder;