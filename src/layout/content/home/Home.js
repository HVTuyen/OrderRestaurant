import React, { useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import { MDBCardTitle, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHistory, faUtensils } from '@fortawesome/free-solid-svg-icons';

import { collection, addDoc } from "firebase/firestore"; 

import { db } from '../../../firebaseConfig';
import style from './Home.module.scss'
import {QLREQUEST_API, TABLE_API} from '../../constants'

function Home() {

    const {id} = useParams()
    console.log(id)
    const [isShowRequest, setIsShowRequest] = useState(false)
    const [title, setTitle] = useState('')
    const  [requestNote, setRequestNote] = useState('')
    const [table, setTable] = useState()

    const handleRequest = () => {
        setIsShowRequest(true)
    }

    useEffect(() => {
        axios.get(`${TABLE_API}${id}`)
            .then(res => {
                setTable(res.data)
            })
            .catch(error => {
                console.error('Error fetching table:', error);
            });
    }, [])

    const handleSendRequest = () => {
        if (title.length === 0) {
            alert('Vui lòng nhập tiêu đề.');
            return;
        }

        const newRequest = {
            tableId: id,
            title: title,
            requestNote: requestNote,
        }

        axios.post(`${QLREQUEST_API}request`, newRequest)
            .then( async () => {
                try {
                    const docRef = await addDoc(collection(db, "orders"), {
                      request: newRequest
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                alert('Gửi yêu cầu thành công')
                setIsShowRequest(false)
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    }

    const Hide = clsx(style.hideOnSmallScreen)
    const modal = clsx(style.modal)
    const containerRequest = clsx(style.containerRequest)
    console.log(title, requestNote)

    return (
        <div style={{height:'100vh'}}>
            <div>
                <Carousel>
                    <Carousel.Item>
                        <img style={{ height: '40vh' }}
                            className="d-block w-100"
                            src={"https://thachan.vn/wp-content/uploads/2023/09/do-an-vat-min-1.jpg"}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img style={{ height: '40vh' }}
                            className="d-block w-100"
                            src={"https://cdn.tgdd.vn/Files/2020/12/16/1314124/thuc-an-nhanh-la-gi-an-thuc-an-nhanh-co-tot-hay-khong-202201201405201587.jpg"}
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img style={{ height: '40vh' }}
                            className="d-block w-100"
                            src={"https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/tac_hai_cua_thuc_an_nhanh_khon_luong_hon_ban_nghi_day1_73d0dba74e.jpeg"}
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <MDBCardBody className="p-4" style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#fff', borderRadius:'8px', border:'1px solid #333' }}>
                    <div className="d-flex text-black">
                        <div className={Hide + ' flex-shrink-0'}>
                            <MDBCardImage
                                style={{ width: '180px', borderRadius: '10px' }}
                                src='https://summundus.org/wp-content/uploads/2014/09/eatwell.jpg'
                                alt='Generic placeholder image'
                                fluid />
                        </div>
                        <div className="flex-grow-1">
                            <MDBCardTitle style={{ margin: "12px 0" }}>Nguyễn Văn A</MDBCardTitle>
                            <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                                style={{ backgroundColor: '#efefef' }}>
                                <div>
                                    <p className="mb-1">{table?.tableName}</p>
                                </div>
                            </div>
                            <div className="d-flex pt-1">
                                <button className="btn btn-outline-primary">Sửa tên </button>
                            </div>
                        </div>
                    </div>
                </MDBCardBody>
            </div>

            <div style={{ height: "60vh", border: "1px solid black", backgroundImage: 'url("https://vuainnhanh.com/wp-content/uploads/2023/02/sticker-cute-food-26.jpg")', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="mb-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link to='' className='col-6' style={{paddingRight:'8px'}}>
                        <Button 
                            variant="primary" 
                            size="lg" 
                            style={{ padding: '8px 12px', margin: '5px', height:'100px', width:'100%' }}
                            onClick={handleRequest}
                        >
                            <FontAwesomeIcon icon={faBell} /> Yêu cầu
                        </Button>
                    </Link>
                    <Link to={`/HistoryOrder/${id}`} className='col-6' style={{paddingRight:'8px'}}>
                        <Button variant="secondary" size="lg" style={{ padding: '8px 12px', margin: '5px', height:'100px', width:'100%'}}>
                            <FontAwesomeIcon icon={faHistory} /> Lịch sử gọi món
                        </Button>
                    </Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to={`/Order/${id}`}>
                        <Button variant="success" size="lg" style={{ padding: '8px 12px', margin: '5px', height:'100px' }}>
                            <FontAwesomeIcon icon={faUtensils} /> Thực đơn, gọi món
                        </Button>
                    </Link>
                </div>
            </div>
            
            {
                isShowRequest && (
                    <div className={modal}>
                        <div className={containerRequest}>
                            <div style={{padding:'24px'}}>
                                <div className="modal-header">
                                    <h2>Gửi yêu cầu</h2>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tiêu đề</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Nhập tiêu đề..."
                                            value={title}
                                            onChange={e => {
                                                setTitle(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nội dung (không bắt buộc)</label>
                                        <textarea 
                                            className="form-control"
                                            rows="3"
                                            value={requestNote}
                                            onChange={e => {
                                                setRequestNote(e.target.value)
                                            }}
                                        >
                                        </textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-primary"
                                        style={{marginRight: '8px'}}
                                        onClick={handleSendRequest}
                                    >
                                        Gửi
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger"
                                        onClick={() => setIsShowRequest(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Home