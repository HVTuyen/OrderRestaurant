import React from "react";
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { collection, addDoc } from "firebase/firestore";

import { db } from '../../../firebaseConfig';
import { QLORDER_API, QLREQUEST_API } from '../../constants'

function HistoryOrder() {

    const { id } = useParams()
    console.log(id)

    const [order, setOrder] = useState()

    useEffect(() => {
        axios.get(`${QLORDER_API}get_bill?tableId=${id}`)
            .then(res => {
                setOrder(res.data)
            })
            .catch(error => {
                console.error('Error fetching order:', error);
            });
    }, [])

    const handlePayment = () => {
        const requestPayment = {
            tableId: id,
            title: 'Yêu cầu thanh toán',
            requestNote: '',
        }

        axios.post(`${QLREQUEST_API}request`, requestPayment)
            .then(async () => {
                try {
                    const docRef = await addDoc(collection(db, "orders"), {
                        request: requestPayment
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                alert('Gửi yêu cầu thành công')
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    }

    console.log(order)

    return (
        <div>
            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="mb-0" style={{ fontWeight: '700', fontSize: '48px', color: '#545bcd' }}>Lịch sử gọi món</div>
                            </div>

                            {order == null ? (
                                <div className="card rounded-3 mb-4">
                                    <div className="card-body p-4 t-center" style={{ fontSize: '28px', fontWeight: '600' }}>
                                        Lịch sử trống
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="card rounded-3 mb-4">
                                        <div className="card-body p-4">
                                            {
                                                order?.allFoods?.map((item, index) => {
                                                    return (
                                                        <div key={item.foodId} className="row d-flex justify-content-between align-items-center" style={{ borderBottom: index === order.allFoods.length - 1 ? 'none' : '1px solid #ccc', paddingBottom: '4px', paddingTop: index === 0 ? '0' : '8px' }}>
                                                            <div className="t-center col-md-2 col-lg-2 col-xl-2">
                                                                <img
                                                                    src={item.urlImage}
                                                                    className="img-fluid rounded-3" alt="Cotton T-shirt"

                                                                />
                                                            </div>
                                                            <div className="t-center col-md-3 col-lg-3 col-xl-3" style={{ paddingTop: '12px' }}>
                                                                <p className="lead fw-normal mb-2">{item.nameFood}</p>
                                                                {/* <p>{item.category.categoryName}</p> */}
                                                            </div>
                                                            <div className="t-center col-md-3 col-lg-2 col-xl-2 d-flex border" style={{ padding: '6px', justifyContent: 'center' }}>
                                                                <label
                                                                    style={{ maxWidth: '100px', textAlign: 'center' }}
                                                                >
                                                                    {item.quantity}
                                                                </label>
                                                            </div>
                                                            <div className="t-center col-md-2 col-lg-2 col-xl-2 offset-lg-1" style={{ padding: '12px 0' }}>
                                                                <h5 className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</h5>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="card rounded-3 mb-4">
                                        <div className="card-body p-4 t-center" style={{ fontSize: '28px', fontWeight: '600' }}>
                                            Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.totalAmount)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="card pinToBottom">
                <div className="card-body d-flex" style={{ justifyContent: 'center' }}>
                    <div style={{ padding: '0 4px' }}>
                        <Link to={`/Home/${id}`} style={{ textDecoration: 'none', minWidth: '90px' }} className="btn btn-outline-danger">Trở về</Link>
                    </div>
                    {
                        order && (
                            <div style={{ padding: '0 4px' }}>
                                <Link
                                    style={{ minWidth: '90px', paddingLeft: '0px', paddingRight: '0px' }}
                                    className="btn btn-outline-success"
                                    onClick={handlePayment}
                                >
                                    Thanh toán
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default HistoryOrder;