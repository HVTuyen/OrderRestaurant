import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlrequest.module.scss'
import { QLREQUEST_API, CONFIG_API, REQUEST_TYPE, REQUEST_COMPLETE_CODE, REQUEST_REFUSE_CODE, REQUEST_COMPLETE_SUB, REQUEST_REFUSE_SUB } from '../../constants'
import { formatDateTimeSQL } from '../../../Functions/formatDateTime'
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../component/Context/AuthProvider';
import { decodeJWT } from '../../../Functions/decodeJWT'
import Pagination from '../../../component/Pagination/Pagination'
import { getRequest } from '../../../CallApi/RequestApi/GetRequest';

function Qlrequest({ activeMenu }) {
    console.log('re-render-qlorder')

    useEffect(() => {
        sessionStorage.setItem('activeMenu', 'request');
        activeMenu('request')
    }, [])

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const handleChange = (e) => {
        sessionStorage.setItem('searchRequest', e.target.value)
        setQlRequest(e.target.value)
    }

    const { token } = useAuth();
    const [qlRequestsSearch, setQlRequestSearch] = useState([])
    const [qlRequest, setQlRequest] = useState(search || '')
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
        const response = await getRequest(data);
        if (response && response.data) {
            setQlRequestSearch(response.data.request);
            setTotalPages(response.data.totalPages);
        } else {
            setQlRequestSearch([])
            setTotalPages(0)
        }
    }

    useEffect(() => {
        console.log(search)
        fetchData();
    }, [render, page, search])

    useEffect(() => {
        console.log('re-render 2')
        axios.get(`${CONFIG_API}search?type=${REQUEST_TYPE}`)
            .then(res => {
                setStatus(res.data);
            })
            .catch(error => {
                console.error('Error fetching status:', error);
            });
    }, [render])

    const requestRef = collection(db, "orders");

    //Thông báo Request
    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(requestRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("requests: ", change.doc.data());
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

    const handleRequest = (id, CODE, SUB) => {
        axios.post(`${QLREQUEST_API}${SUB}/${id}`)
            .then(res => {
                fetchData()
            })
            .catch(error => {
                console.error('Error accept:', error);
            });
    }

    const handleDeleteRequest = (id) => {
        axios.delete(`${QLREQUEST_API}${id}`)
            .then(res => {
                fetchData()
            })
            .catch(error => {
                console.error('Error delete:', error);
            });
    }

    const classQlrequestSearch = clsx(style.qlrequestSearch, 'input-group')
    const classQlrequestButton = clsx(style.qlrequestButton, 'btn btn-outline-primary')
    const classQlrequestIcon = clsx(style.qlrequestIcon)
    const classQlrequestTable = clsx(style.qlrequestTable, 'table table-center')
    const classQlrequestCol_0_5 = clsx(style.qlrequestCol, 'col-0-5')
    const classQlrequestCol_1 = clsx(style.qlrequestCol, 'col-1')
    const classQlrequestCol_1_5 = clsx(style.qlrequestCol, 'col-1-5')
    const classQlrequestCol_2 = clsx(style.qlrequestCol, 'col-2')
    const classQlrequestCol_3 = clsx(style.qlrequestCol, 'col-3')


    console.table(render)
    console.table(qlRequestsSearch)
    console.log(status)
    console.log(qlRequest)

    return (
        <div className="col-10">
            <div className='title'>Danh sách yêu cầu</div>
            <div className={classQlrequestSearch}>
                <select
                    style={{ maxWidth: '210px' }}
                    className="form-select"
                    value={statusSelect}
                    onChange={e => {
                        setStatusSelect(e.target.value)
                    }}
                >
                    <option value="">--Trạng thái yêu cầu--</option>
                    {status.map(status => (
                        <option key={status.code} value={status.code}>{status.value}</option>
                    ))}
                </select>
                <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..."
                    value={qlRequest}
                    onChange={(e) => handleChange(e)}
                />
                <Link className={classQlrequestButton}
                    to={`/Ql/Action/Request?page=1&search=${qlRequest}`}
                >
                    <FontAwesomeIcon icon={faSearch} className={classQlrequestIcon} style={{ width: '100%' }} />
                </Link>
            </div>

            {
                qlRequestsSearch ? (
                    <>
                        <table className={classQlrequestTable}>
                            <thead className="table-secondary">
                                <tr>
                                    <th className={classQlrequestCol_1}>#</th>
                                    <th className={classQlrequestCol_1}>Bàn</th>
                                    <th className={classQlrequestCol_2}>Thời gian gửi</th>
                                    <th className={classQlrequestCol_2}>Tình trạng</th>
                                    <th className={classQlrequestCol_2}>Tiêu đề</th>
                                    <th className={classQlrequestCol_3}>Xử lý</th>
                                    <th className={classQlrequestCol_1}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    qlRequestsSearch?.map((item, index) => {
                                        return (
                                            <tr key={item.requestId}>
                                                <th className={classQlrequestCol_1}>{index + 1}</th>
                                                <td className={classQlrequestCol_1}>{item.tables.tableName}</td>
                                                <td className={classQlrequestCol_2}>{formatDateTimeSQL(item.requestTime)}</td>
                                                <td className={classQlrequestCol_2}>{getStatusByCode(item.code)?.value}</td>
                                                <td className={classQlrequestCol_2}>{item.title}</td>
                                                <td className={classQlrequestCol_3 + ' t-center'}>
                                                    <div className="btn-group" role="group" aria-label="Basic outlined example" style={{ width: '100%' }}>
                                                        {item.code === 1 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary padding-6"
                                                                    style={{ marginRight: '1px', width: '50%' }}
                                                                    onClick={() => handleRequest(item.requestId, REQUEST_COMPLETE_CODE, REQUEST_COMPLETE_SUB)}
                                                                >
                                                                    Hoàn thành
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger padding-6"
                                                                    style={{ width: '50%' }}
                                                                    onClick={() => handleRequest(item.requestId, REQUEST_REFUSE_CODE, REQUEST_REFUSE_SUB)}
                                                                >
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}

                                                        {item.code === 3 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger padding-6"
                                                                // style={{width:'130px'}}
                                                                onClick={() => handleDeleteRequest(item.requestId)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className={classQlrequestCol_1 + ' t-center'}>
                                                    <Link to={`/Ql/Action/Request/${item.requestId}`}>Chi tiết...</Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <Pagination
                            url='Request'
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


export default Qlrequest;