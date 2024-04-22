import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './product.module.scss'
import { PRODUCT_API, CATEGORY_API } from '../constants'

function Product() {
    console.log('re-render-product')
    const [products,setProducts] = useState([])
    const [productsSearch,setProductsSearch] = useState([])
    const [product,setProduct] = useState('')

    const [categories,setCategories] = useState([])
    const [categoryId,setCategoryId] = useState('')

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
        axios.get(CATEGORY_API)
            .then(res => {
                setCategories(res.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [])

    useEffect(() => {
        setProductsSearch(product ? products.filter(item => item.nameFood.includes(product)) : products);
    }, [product])

    useEffect(() => {
        setProductsSearch(categoryId ? products.filter(item => item.categoryId == categoryId) : products);
    }, [categoryId])
    
    console.log(product)
    console.log(products)
    console.log(productsSearch)

    console.log(categoryId)

    const classProductSearch = clsx(style.productSearch, 'input-group')
    const classProductButton = clsx(style.productButton, 'btn btn-outline-primary')
    const classProductIcon = clsx(style.productIcon)
    const classProductTable = clsx(style.productTable, 'table')
    const classProductColId = clsx(style.productCol, 'col-1')
    const classProductColImg = clsx(style.productCol, 'col-1')
    const classProductColName = clsx(style.productCol, 'col-3')
    const classProductColPrice = clsx(style.productCol, 'col-3')
    const classProductColCategory = clsx(style.productCol, 'col-3')
    const classProductColAction = clsx(style.productCol, 'col-1')
    const classProductTableIcon = clsx(style.productTableIcon)

    return (
        <div className="col-10">
            <div className='title'>Danh sách món ăn</div>
            <div className={classProductSearch}>

                <select
                    style={{maxWidth: '180px'}}
                    className="form-select"
                    value={categoryId}
                    onChange={e => {
                        setProduct('')
                        setCategoryId(e.target.value)
                    }}
                >
                    <option value="">Chọn loại món ăn</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                    ))}
                </select>

                <input type="text" className="form-control" placeholder="Nhập tên món ăn cần tìm..." 
                    value={product}
                    onChange={e => {
                        setProduct(e.target.value)
                        setCategoryId('')
                    }}
                />
                <button className={classProductButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classProductIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classProductButton} to='/Product/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classProductIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classProductTable}>
                <thead>
                    <tr>
                        <th align='center' className={classProductColId}>#</th>
                        <th className={classProductColImg}>Ảnh</th>
                        <th className={classProductColName}>Tên món ăn</th>
                        <th className={classProductColPrice}>Đơn giá</th>
                        <th className={classProductColCategory}>Loại món</th>
                        <th className={classProductColAction}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productsSearch?.map((item, index) => {
                            return (
                                <tr key={item.foodId}>
                                    <th className={classProductColId}>{index + 1}</th>
                                    <th className={classProductColImg}>
                                        <img loading='lazy' src={item.urlImage} alt={item.nameFood} width="80" height="80"/>
                                    </th>
                                    <td className={classProductColName}>{item.nameFood}</td>
                                    <td className={classProductColPrice}>{item.unitPrice}</td>
                                    <td className={classProductColCategory}>{item.category.categoryName}</td>
                                    <th className={classProductColAction}>
                                        <Link to={`/Product/Edit/${item.foodId}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classProductTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Product/Delete/${item.foodId}`}>
                                            <FontAwesomeIcon icon={faTrash} className={classProductTableIcon} style={{color:'#ff5252'}}/>
                                        </Link>
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}


export default Product;