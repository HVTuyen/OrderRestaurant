import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { PRODUCT_API, CATEGORY_API } from '../../constants'

function ProductDelete( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [product,setProduct] = useState('')

    const [category,setCategory] = useState('')

    useEffect(() => {
        axios.get(`${PRODUCT_API}${id}`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [])

    const deleteProduct = async () => {
        axios.delete(`${PRODUCT_API}${id}`)
            .then(() => {
                console.log('Product deleted successfully');
                navigate('/Ql/Product');
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
                        <img src={product.urlImage} style={{maxWidth:'30%', height:'100%', border:'1px solid #f0e8e8'}}/>
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
                        <label className="col-sm-9 col-form-label">{product.category?.categoryName}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={deleteProduct}
                        >
                            Xác nhận xóa
                        </button>
                        <Link to='/Ql/Product' className='btn btn-outline-danger'>
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