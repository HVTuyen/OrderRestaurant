import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './product.module.scss'

function Product() {
    console.log('re-render-product')
    const [products,setProducts] = useState([])
    const [productsSearch,setProductsSearch] = useState([])
    const [product,setProduct] = useState('')

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(res => res.json())
            .then(data => {
                setProducts(data.slice(0, 10))
                setProductsSearch(data.slice(0, 10))
            })
    }, [])

    useEffect(() => {
        setProductsSearch(product ? products.filter(item => item.title.includes(product)) : products);
    }, [product])
    
    console.log(product)
    console.log(products)
    console.log(productsSearch)

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
                <input type="text" className="form-control" placeholder="Nhập tên món ăn cần tìm..." 
                    value={product}
                    onChange={e => setProduct(e.target.value)}
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
                        productsSearch.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <th className={classProductColId}>{item.id}</th>
                                    <th className={classProductColImg}>
                                        <img src={item.thumbnailUrl} alt={item.title} width="80" height="80"/>
                                    </th>
                                    <th className={classProductColName}>{item.title}</th>
                                    <th className={classProductColPrice}></th>
                                    <th className={classProductColCategory}></th>
                                    <th className={classProductColAction}>
                                        <Link to={`/Product/Edit/${item.id}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classProductTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Product/Delete/${item.id}`}>
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