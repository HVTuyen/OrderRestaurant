import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { PRODUCT_API } from '../constants'

function ProductDelete( ) {
    const {id} = useParams()
    console.log(id)

    const [product,setProduct] = useState('')

    useEffect(() => {
        axios.get(`${PRODUCT_API}${id}`)
            .then(res => {
                setProduct(res.data)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [])

    const deleteProduct = async () => {
        axios.delete(`${PRODUCT_API}${id}`)
            .then(() => {
                console.log('Product deleted successfully');
                window.location.href = '/Product'; // Điều hướng về Product sau khi xóa
            })
            .catch(error => {
                console.error('Error delete Product:', error);
            });
    }

    console.log(product)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa món ăn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <img className="col-sm-4" src={`data:image/jpeg;base64,${product.urlImage}`} alt={product.nameFood} height="100%"/>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên món ăn</label>
                        <label className="col-sm-9 col-form-label">{product.nameFood}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Giá</label>
                        <label className="col-sm-9 col-form-label">{product.unitPrice}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <label className="col-sm-9 col-form-label">{product.categoryId}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            to='/Product' 
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={deleteProduct}
                        >
                            Xác nhận xóa
                        </button>
                        <Link to='/Product' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default ProductDelete;