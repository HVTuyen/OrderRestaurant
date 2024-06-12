import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import { QLREQUEST_API, REQUEST_TYPE, CONFIG_API, REQUEST_COMPLETE_CODE, REQUEST_REFUSE_CODE} from '../../constants'
import style from './qlrequest.module.scss'
import {formatDateTimeSQL} from '../../../Functions/formatDateTime'
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'
import { refuseRequest } from '../../../CallApi/RequestApi/refuseRequest'
import { deleteRequest } from '../../../CallApi/RequestApi/deleteRequest';
import { completeRequest } from '../../../CallApi/RequestApi/completeRequest'
import ModalDelete from '../../../component/Modal/ModalDelete'

function QlrequestDetail( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const searchRequest = sessionStorage.getItem('searchRequest')
    const searchStatus = sessionStorage.getItem('searchStatusRequest')
    const startDate = sessionStorage.getItem('searchStartDateRequest');
    const endDate = sessionStorage.getItem('searchEndDateRequest');

    const [request,setRequest] = useState([])
    const [status,setStatus] = useState([])
    const [render,setRender] = useState()
    const [isShowModal, setIsShowModal] = useState(false)

    useEffect(() => {
        axios.get(`${QLREQUEST_API}${id}`)
            .then(res => {
                setRequest(res.data);
                axios.get(`${CONFIG_API}type?type=${REQUEST_TYPE}`)
                    .then(res => {
                        setStatus(res.data);
                    })
                    .catch(error => {
                        console.error('Error fetching status:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching request:', error);
            });
    }, [render])

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

    const handleRequest = async (id, CODE) => {
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
                    const newDataResponse = await handleRequestType(newconfig, id, CODE);
                    if (newDataResponse) {
                        setRender(Math.random())
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
            navigate(`/Ql/Action/Request?page=1&search=${searchRequest || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
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
                        navigate(`/Ql/Action/Request?page=1&search=${searchRequest || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
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

    const classQlorderButton = clsx(style.qlrequestButton, 'btn btn-outline-primary')
    const classQlorderIcon = clsx(style.qlrequestIcon)

    console.log(request)
    
    return (
        <div className="col-10">
            <div className='title'>Chi tiết đơn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Bàn gửi</label>
                        <label className="col-sm-9 col-form-label">{request?.table?.name}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Thời gian gửi</label>
                        <label className="col-sm-9 col-form-label">{formatDateTimeSQL(request?.createTime)}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tình trạng</label>
                        <label className="col-sm-4 col-form-label">{getStatusByCode(request?.code)?.value}</label>
                        <div className="col-sm-5 col-form-label d-flex">
                            {request.code === 1 && (
                                <>
                                    <button 
                                        className="btn btn-outline-primary padding-6 col-6"
                                        style={{marginRight:'1px'}}
                                        onClick={() => handleRequest(id, REQUEST_COMPLETE_CODE)}
                                    >
                                        Đã hoàn thành
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger padding-6 col-6"
                                        style={{marginRight:'1px'}}
                                        onClick={() => handleRequest(id, REQUEST_REFUSE_CODE)}
                                    >
                                        Từ chối
                                    </button>
                                </>
                            )}

                            {request.code === 3 && (
                                <button 
                                    type="button" 
                                    className="btn btn-outline-danger padding-6 col-12"
                                    // style={{width:'130px'}}
                                    onClick={() => handleDeleteRequest(id)}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                        
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tiêu đề</label>
                        <label className="col-sm-9 col-form-label">{request?.title}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Nội dung</label>
                        <label className="col-sm-9 col-form-label">{request?.content}</label>
                    </div>
                </div>
                <div className='col-2 d-flex j-flex-end' style={{height:'40px', paddingRight:'24px'}}>
                    <button 
                        className='btn btn-outline-danger'
                        onClick={() => {
                            navigate(`/Ql/Action/Request?page=1&search=${searchRequest || ''}&code=${searchStatus || ''}&fromTime=${startDate || ''}&toTime=${endDate || ''}`)
                        }}
                    >
                        Trở về
                    </button>
                </div>
            </div>
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

export default QlrequestDetail;