import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import { QLREQUEST_API, REQUEST_TYPE, CONFIG_API, REQUEST_COMPLETE_SUB, REQUEST_REFUSE_SUB} from '../../constants'
import style from './qlrequest.module.scss'
import {formatDateTimeSQL} from '../../../Functions/formatDateTime'

function QlrequestDetail( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [request,setRequest] = useState([])
    const [status,setStatus] = useState([])
    const [render,setRender] = useState()

    useEffect(() => {
        axios.get(`${QLREQUEST_API}${id}`)
            .then(res => {
                setRequest(res.data);
                axios.get(`${CONFIG_API}search?type=${REQUEST_TYPE}`)
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

    const handleRequest = (id, SUB) => {
        axios.post(`${QLREQUEST_API}${SUB}/${id}`)
        .then(res => {
            axios.get(`${QLREQUEST_API}get-request-all`)
            .then(res => {
                setRequest(res.data);
                setRender(Math.random())
            })
            .catch(error => {
                console.error('Error fetching qlRequest:', error);
            });
        })
        .catch(error => {
            console.error('Error accept:', error);
        });
    }

    const handleDeleteRequest = (id) => {
        axios.delete(`${QLREQUEST_API}${id}`)
        .then(res => {
            axios.get(`${QLREQUEST_API}get-request-all`)
            .then(res => {
                alert('Xóa yêu cầu thành công')
                navigate('/Ql/Action/Request');
            })
            .catch(error => {
                console.error('Error fetching qlRequest:', error);
            });
        })
        .catch(error => {
            console.error('Error accept:', error);
        });
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
                        <label className="col-sm-9 col-form-label">{request.tables?.tableName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Thời gian gửi</label>
                        <label className="col-sm-9 col-form-label">{formatDateTimeSQL(request.requestTime)}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tình trạng</label>
                        <label className="col-sm-4 col-form-label">{getStatusByCode(request.code)?.value}</label>
                        <div className="col-sm-5 col-form-label d-flex">
                            {request.code === 1 && (
                                <>
                                    <button 
                                        className="btn btn-outline-primary padding-6 col-6"
                                        style={{marginRight:'1px'}}
                                        onClick={() => handleRequest(id, REQUEST_COMPLETE_SUB)}
                                    >
                                        Đã hoàn thành
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger padding-6 col-6"
                                        style={{marginRight:'1px'}}
                                        onClick={() => handleRequest(id, REQUEST_REFUSE_SUB)}
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
                        <label className="col-sm-9 col-form-label">{request.title}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Nội dung</label>
                        <label className="col-sm-9 col-form-label">{request.requestNote}</label>
                    </div>
                </div>
                <div className='col-2 d-flex j-flex-end' style={{height:'40px', paddingRight:'24px'}}>
                    <button 
                        className='btn btn-outline-danger'
                        onClick={() => {
                            navigate('/Ql/Action/Request')
                        }}
                    >
                        Trở về
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QlrequestDetail;