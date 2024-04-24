import React from "react";
import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'

import {PRODUCT_API} from '../../constants'

function Order() {

    const {id} = useParams()
    console.log(id)

    const [products,setProducts] = useState([])
    const [productsSearch,setProductsSearch] = useState([])
    const [product,setProduct] = useState('')
    const [quantity, setQuantity] = useState({});

    console.table(products)

    useEffect(() => {
        axios.get(PRODUCT_API)
            .then(res => {
                setProducts(res.data);
                setProductsSearch(res.data);
            })
            .catch(error => {
                console.error('Error fetching Products:', error);
            });
    }, [])

    useEffect(() => {
        setProductsSearch(product ? products.filter(item => item.nameFood.includes(product)) : products);
    }, [product])

    const handleQuantityChange = (id, change) => {
        setQuantity(prevState => ({
            ...prevState,
            [id]: (prevState[id] || 1) + change
        }));
    };

    const handleAddToCart = (id) => {
        const selectedProduct = products.find(item => item.foodId === id);
        if (selectedProduct) {
            // Lấy danh sách giỏ hàng từ localStorage
            let cartItems = localStorage.getItem('cartItems');
            cartItems = cartItems ? JSON.parse(cartItems) : [];
    
            // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng chưa
            const existingCartItemIndex = cartItems.findIndex(item => item.foodId === id);
            if (existingCartItemIndex !== -1) {
                // Nếu món ăn đã tồn tại, cập nhật số lượng
                cartItems[existingCartItemIndex].quantity += (quantity[id] || 1);
            } else {
                // Nếu món ăn chưa tồn tại, thêm mới vào giỏ hàng
                const cartItem = {
                    ...selectedProduct,
                    quantity: quantity[id] || 1
                };
                cartItems.push(cartItem);
            }
    
            // Lưu danh sách giỏ hàng mới vào localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
        alert('Thêm vào giỏ hàng thành công!');
    };

    return (
        <div>
            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="mb-0" style={{fontWeight:'700', fontSize:'48px', color:'#545bcd'}}>Menu</div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-body p-4 d-flex flex-row">
                                    <div data-mdb-input-init className="form-outline flex-fill">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg" 
                                            placeholder="Nhập tên món ăn..."
                                            value={product}
                                            onChange={e => {
                                                setProduct(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {
                                productsSearch?.map(item => {
                                    return (
                                        <div key={item.foodId} className="card rounded-3 mb-4">
                                            <div className="card-body p-4">
                                                <div className="row d-flex justify-content-between align-items-center">
                                                    <div className="t-center col-md-2 col-lg-2 col-xl-2">
                                                        <img
                                                            src={item.urlImage}
                                                            className="img-fluid rounded-3" alt="Cotton T-shirt"
                                                            
                                                        />
                                                    </div>
                                                    <div className="t-center col-md-3 col-lg-3 col-xl-3" style={{paddingTop:'12px'}}>
                                                        <p className="lead fw-normal mb-2">{item.nameFood}</p>
                                                        <p>{item.category.categoryName}</p>
                                                    </div>
                                                    <div className="t-center col-md-3 col-lg-2 col-xl-2 d-flex" style={{paddingRight:'0', paddingLeft:'0', justifyContent: 'center'}}>
                                                        <button
                                                            className="btn btn-link px-2"
                                                            onClick={() => handleQuantityChange(item.foodId, -1)}
                                                            style={{border: '1px solid #ccc'}}
                                                        >
                                                            <FontAwesomeIcon icon={faMinus} style={{fontSize:'24px'}}/>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min='1'
                                                            className="form-control form-control-sm" 
                                                            value={quantity[item.foodId] || 1}
                                                            onChange={() => {}}
                                                            style={{maxWidth:'100px', textAlign:'center'}}
                                                        />
                                                        <button 
                                                            className="btn btn-link px-2"
                                                            onClick={() => handleQuantityChange(item.foodId, 1)}
                                                            style={{border: '1px solid #ccc'}}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} style={{fontSize:'24px'}}/>
                                                        </button>
                                                    </div>
                                                    <div className="t-center col-md-2 col-lg-2 col-xl-2 offset-lg-1" style={{padding:'12px 0'}}>
                                                        <h5 className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice * quantity[item.foodId] || item.unitPrice)}</h5>
                                                    </div>
                                                    <div className="t-center col-md-2 col-lg-2 col-xl-2 text-end">
                                                        <button 
                                                            className="btn btn-primary"
                                                            onClick={() => handleAddToCart(item.foodId)}
                                                        >
                                                            <div>Add</div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            <div className="card">
                                <div className="card-body d-flex" style={{justifyContent:'center'}}>
                                    <div style={{padding: '0 4px', minWidth: '90px'}}>
                                        <button type="button" className="btn btn-warning btn-block btn-lg" style={{width:'100%', padding:'0', height:'40px'}}>
                                            <Link to='/' style={{textDecoration:'none', fontSize:'16px', display:'flex', justifyContent:'center',alignItems:'center', height:'100%'}}>Trở về</Link>
                                        </button>
                                    </div>
                                    <div style={{padding: '0 4px', minWidth: '90px'}}>
                                        <button type="button" className="btn btn-warning btn-block btn-lg" style={{width:'100%', padding:'0', height:'40px'}}>
                                            <Link to={`/Cart/${id}`} style={{textDecoration:'none', fontSize:'16px', display:'flex', justifyContent:'center',alignItems:'center', height:'100%'}}>Giỏ hàng</Link>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Order;
