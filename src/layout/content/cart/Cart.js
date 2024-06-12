import React from "react";
import { useEffect, useState } from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import { collection, addDoc } from "firebase/firestore"; 

import { db } from '../../../firebaseConfig';
import {QLORDER_API} from '../../constants'

function Cart() {

    const {id} = useParams()
    console.log(id)

    const navigate = useNavigate();

    const [products,setProducts] = useState([])
    const [quantity, setQuantity] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    // Lấy dữ liệu từ localStorage khi component được render
    useEffect(() => {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            setProducts(JSON.parse(storedItems));
    
            // Lấy số lượng từ dữ liệu localStorage và cập nhật vào state quantity
            const initialQuantities = {};
            JSON.parse(storedItems).forEach(item => {
                initialQuantities[item.foodId] = item.quantity;
            });
            setQuantity(initialQuantities);

            // Tính tổng tiền
            const total = JSON.parse(storedItems).reduce((acc, curr) => {
                return acc + curr.unitPrice * initialQuantities[curr.foodId];
            }, 0);
            setTotalPrice(total);
        }
    }, []);

    console.table(products)

    const updateLocalStorage = (id, newQuantity) => {
        let cartItems = localStorage.getItem('cartItems');
        cartItems = cartItems ? JSON.parse(cartItems) : [];
    
        // Tìm kiếm sản phẩm trong giỏ hàng
        const existingCartItemIndex = cartItems.findIndex(item => item.foodId === id);
    
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        if (existingCartItemIndex !== -1) {
            cartItems[existingCartItemIndex].quantity = newQuantity;
        }
    
        // Lưu danh sách giỏ hàng mới vào localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    // Hàm thay đổi số lượng sản phẩm
    const handleQuantityChange = (id, change) => {
    setQuantity(prevState => {
        const newQuantity = (prevState[id] || 1) + change;
        updateLocalStorage(id, newQuantity); // Cập nhật localStorage
        
        // Tính lại tổng tiền sau khi thay đổi số lượng sản phẩm
        const newTotalPrice = products.reduce((total, product) => {
            if (product.foodId === id) {
                return total + product.unitPrice * newQuantity;
            } else {
                return total + product.unitPrice * (prevState[product.foodId] || 1);
            }
        }, 0);
        setTotalPrice(newTotalPrice);

        return {
            ...prevState,
            [id]: newQuantity
        };
    });
};

    const handleRemoveToCart = (id) => {
        // Lấy danh sách giỏ hàng từ localStorage
        let cartItems = localStorage.getItem('cartItems');
        cartItems = cartItems ? JSON.parse(cartItems) : [];

        // Tìm vị trí của sản phẩm trong giỏ hàng
        const index = cartItems.findIndex(item => item.foodId === id);

        // Nếu sản phẩm được tìm thấy trong giỏ hàng, xóa sản phẩm đó
        if (index !== -1) {
            cartItems.splice(index, 1);
            // Cập nhật lại danh sách giỏ hàng trong localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Cập nhật lại state products và quantity
            setProducts([...cartItems]);

            // Cập nhật lại state quantity
            const updatedQuantities = { ...quantity };
            delete updatedQuantities[id];
            setQuantity(updatedQuantities);

            // Tính lại tổng tiền
            const newTotalPrice = cartItems.reduce((total, product) => {
                return total + product.unitPrice * (quantity[product.foodId] || 1);
            }, 0);
            setTotalPrice(newTotalPrice);
        }
        alert('Xóa món ăn thành công')
    };

    const handleRemoveAll = () => {
        // Xóa tất cả các sản phẩm trong localStorage
        localStorage.removeItem('cartItems');
    
        // Cập nhật state products và quantity về trạng thái rỗng
        setProducts([]);
        setQuantity({});
    
        // Cập nhật tổng tiền về 0
        setTotalPrice(0);
    
        alert('Xóa toàn bộ giỏ hàng thành công');
    };

    const createOrder = () => {
        // Kiểm tra nếu giỏ hàng trống
        if (products.length === 0) {
            alert('Giỏ hàng trống. Không thể đặt hàng.');
            return;
        }
    
        // Tạo mảng items từ state products
        const items = products.map(item => ({
            foodId: item.foodId,
            quantity: quantity[item.foodId] || 1
        }));
    
        // Tạo đối tượng newOrder với dữ liệu được yêu cầu
        const newOrder = {
            tableId: id, // Lấy từ useParams()
            foods: items,
        };
    
        // Gửi request POST đến API để tạo đơn hàng mới
        axios.post(`${QLORDER_API}`, newOrder)
            .then( async () => {
                try {
                    const docRef = await addDoc(collection(db, "orders"), {
                      tableId: newOrder.tableId,
                      items: newOrder.foods,
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                console.error("Error adding document: ", e);
                }
                localStorage.removeItem('cartItems');
    
                // Cập nhật state products và quantity về trạng thái rỗng
                setProducts([]);
                setQuantity({});
            
                // Cập nhật tổng tiền về 0
                setTotalPrice(0);
                
                navigate(`/Order/${id}`);
                alert('Order thành công')
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    };
    

    return (
        <div>
            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="mb-0" style={{fontWeight:'700', fontSize:'48px', color:'#545bcd'}}>Giỏ hàng</div>
                            </div>
                            
                            {products.length === 0 ? (
                                <div className="card rounded-3 mb-4">
                                    <div className="card-body p-4 t-center" style={{fontSize:'28px', fontWeight: '600'}}>
                                        Giỏ hàng trống
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="card rounded-3 mb-4">
                                        <div className="card-body p-4">
                                            {
                                                products?.map((item, index) => {
                                                    return (
                                                        <div key={item.foodId} className="row d-flex justify-content-between align-items-center" style={{ borderBottom: index === products.length - 1 ? 'none' : '1px solid #ccc' , paddingBottom:'4px', paddingTop: index === 0 ? '0' : '8px'}}>
                                                            <div className="t-center col-md-2 col-lg-2 col-xl-2">
                                                                <img
                                                                    loading="lazy"
                                                                    src={item.urlImage}
                                                                    className="img-fluid rounded-3" alt="Cotton T-shirt"
                                                                    
                                                                />
                                                            </div>
                                                            <div className="t-center col-md-3 col-lg-3 col-xl-3" style={{paddingTop:'12px'}}>
                                                                <p className="lead fw-normal mb-2">{item.name}</p>
                                                                <p>{item.category.name}</p>
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
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleRemoveToCart(item.foodId)}
                                                                >
                                                                    <div>Xóa</div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="card rounded-3 mb-4">
                                        <div className="card-body p-4 t-center" style={{fontSize:'28px', fontWeight: '600'}}>
                                            Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                            <div style={{padding:'6px 12px'}}>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={handleRemoveAll}
                                                >
                                                    Xóa toàn bộ giỏ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="card pinToBottom">
                <div className="card-body d-flex" style={{justifyContent:'center'}}>
                    <div style={{padding: '0 4px'}}>
                        <Link to={`/Order/${id}`} className="btn btn-outline-danger" style={{minWidth:'90px'}}>Trở về</Link>
                    </div>
                    <div style={{padding: '0 4px'}}>
                        <Link 
                            style={{minWidth:'90px'}}
                            className="btn btn-outline-primary"
                            onClick={createOrder}
                        >
                            Xác nhận
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
