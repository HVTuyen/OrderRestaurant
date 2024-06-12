import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlrequest.module.scss'
import { QLREQUEST_API, CONFIG_API, REQUEST_TYPE, REQUEST_COMPLETE_CODE, REQUEST_REFUSE_CODE, REQUEST_COMPLETE_SUB, REQUEST_REFUSE_SUB } from '../../constants'
import { formatDateTimeSQL } from '../../../Functions/formatDateTime'
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'
import { decodeJWT } from '../../../Functions/decodeJWT'
import Pagination from '../../../component/Pagination/Pagination'
import { getRequest } from '../../../CallApi/RequestApi/GetRequest';
import { formatDateTimeSearch } from '../../../Functions/formatDateTime';
import { refuseRequest } from '../../../CallApi/RequestApi/refuseRequest'
import { deleteRequest } from '../../../CallApi/RequestApi/deleteRequest';
import { completeRequest } from '../../../CallApi/RequestApi/completeRequest'
import ModalDelete from '../../../component/Modal/ModalDelete';

function Qlrequest({ activeMenu }) {
    console.log('re-render-qlorder')

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    useEffect(() => {
        sessionStorage.setItem('activeMenu', 'request');
        activeMenu('request')
    }, [])

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const searchStartDateRequest = searchParams.get('fromTime');
    const searchEndDateRequest = searchParams.get('toTime');
    const searchStatusRequest = searchParams.get('code');
    const searchRequest = searchParams.get('search');

    const handleChangeSearchEndDate = (date) => {
        sessionStorage.setItem('searchEndDateRequest', formatDateTimeSearch(date))
        setEndDate(formatDateTimeSearch(date))
    }

    const handleChangeSearchStartDate = (date) => {
        sessionStorage.setItem('searchStartDateRequest', formatDateTimeSearch(date))
        setStartDate(formatDateTimeSearch(date))
    }

    const handleChangeSearchStatus = (e) => {
        sessionStorage.setItem('searchStatusRequest', e.target.value)
        setStatusSelect(e.target.value)
    }

    const handleChangeSearch = (e) => {
        sessionStorage.setItem('searchRequest', e.target.value)
        setQlRequest(e.target.value)
    }

    const [startDate, setStartDate] = useState(searchStartDateRequest || formatDateTimeSearch(new Date()));
    const [endDate, setEndDate] = useState(searchEndDateRequest || formatDateTimeSearch(new Date()));
    const [qlRequestsSearch, setQlRequestSearch] = useState([])
    const [qlRequest, setQlRequest] = useState(searchRequest || '')
    const [status, setStatus] = useState([])
    const [statusSelect, setStatusSelect] = useState(searchStatusRequest || '')
    const [render, setRender] = useState(0)
    const [user, setUser] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [id, setId] = useState('');
    const [isShowModal, setIsShowModal] = useState(false)

    useEffect(() => {
        if (token) {
            setUser(decodeJWT(token))
        }
    }, [])

    const fetchData = async () => {
        let data = {
            startTime: startDate,
            endTime: endDate,
            page: page,
            pageSize: pageSize
        }
        if (searchRequest?.length > 0) {
            data.search = searchRequest;
        }
        if (searchStatusRequest?.length > 0) {
            data.Code = searchStatusRequest;
        }
        if (searchStartDateRequest?.length > 0) {
            data.startTime = searchStartDateRequest;
        }
        if (searchEndDateRequest?.length > 0) {
            data.endTime = searchEndDateRequest;
        }
        const response = await getRequest(data);
        if (response && response.data) {
            setQlRequestSearch(response.data.data);
            setTotalPages(response.data.totalPages)
        } else {
            setQlRequestSearch([])
            setTotalPages(0)
        }
    }

    useEffect(() => {
        console.log(searchRequest)
        fetchData();
    }, [render, page, searchRequest, searchStatusRequest, searchStartDateRequest, searchEndDateRequest])

    useEffect(() => {
        console.log('re-render 2')
        axios.get(`${CONFIG_API}type?type=${REQUEST_TYPE}`)
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

    const handleRequestType = async (config, id, CODE) => {
        if (CODE === 3) {
            return refuseRequest(config, id)
        }
        if (CODE === 2) {
            return completeRequest(config, id)
        }
    }

    const handleRequest = async (id, CODE, SUB) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await handleRequestType(config, id, CODE);
        if (response && !response.error) {
            fetchData()
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
                    const newDataResponse = await handleRequestType(newconfig, id, CODE);
                    if (newDataResponse) {
                        fetchData()
                    } else {
                        console.error('Error refuse request after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error refuse request');
            }
        }
    }

    const handleDeleteRequest = async (id) => {
        setId(id)
        setIsShowModal(true)
    }

    const handleModal = (action) => {
        if (!action) {
            setIsShowModal(false)
        }
        else {
            acceptDeleteRequest(id)
            setIsShowModal(false)
        }
    }

    const acceptDeleteRequest = async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await deleteRequest(config, id);
        if (response && !response.error) {
            fetchData()
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
                    const newDataResponse = await deleteRequest(newconfig, id);
                    if (newDataResponse) {
                        fetchData()
                    } else {
                        console.error('Error refuse request after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error refuse request');
            }
        }
    }

    const classQlRequestDatePicker = clsx(style.qlRequestDatePicker, 'form-control');
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
                <DatePicker
                    className={classQlRequestDatePicker}
                    selected={startDate}
                    onChange={(date) => {
                        if (date) {
                            handleChangeSearchStartDate(date)
                        }
                    }}
                    dateFormat="dd/MM/yyyy"
                />
                <DatePicker
                    className={classQlRequestDatePicker}
                    selected={endDate}
                    onChange={(date) => {
                        if (date) {
                            handleChangeSearchEndDate(date)
                        }
                    }}
                    dateFormat="dd/MM/yyyy"
                />
                <select
                    style={{ maxWidth: '210px' }}
                    className="form-select"
                    value={statusSelect}
                    onChange={e => handleChangeSearchStatus(e)}
                >
                    <option value="">--Trạng thái yêu cầu--</option>
                    {status.map(status => (
                        <option key={status.code} value={status.code}>{status.value}</option>
                    ))}
                </select>
                <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..."
                    value={qlRequest}
                    onChange={(e) => handleChangeSearch(e)}
                />
                <Link className={classQlrequestButton}
                    to={`/Ql/Action/Request?page=1&search=${qlRequest}&code=${statusSelect}&fromTime=${startDate}&toTime=${endDate}`}
                >
                    <FontAwesomeIcon icon={faSearch} className={classQlrequestIcon} style={{ width: '100%' }} />
                </Link>
            </div>

            {
                qlRequestsSearch?.length > 0 ? (
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
                                                <th className={classQlrequestCol_1}>{(page - 1) * pageSize + index + 1}</th>
                                                <td className={classQlrequestCol_1}>{item?.table?.name}</td>
                                                <td className={classQlrequestCol_2}>{formatDateTimeSQL(item?.createTime)}</td>
                                                <td className={classQlrequestCol_2}>{getStatusByCode(item?.code)?.value}</td>
                                                <td className={classQlrequestCol_2}>{item?.title}</td>
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
                            url='Action/Request'
                            totalPages={totalPages}
                            currentPage={page}
                            search={searchRequest}
                        />
                    </>
                ) : (
                    <div className='d-flex j-center' style={{ fontSize: '24px', margin: '12px' }}>
                        Không tìm thấy kết quả!
                    </div>
                )
            }

            {
                isShowModal && (
                    <ModalDelete
                        handleModal={handleModal}
                        title='yêu cầu'
                    />
                )
            }
        </div>
    )
}


export default Qlrequest;