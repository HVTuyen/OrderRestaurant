import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './product.module.scss'
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken} from '../../../CallApi/renewToken'
import { getCategories } from '../../../CallApi/CategoryApi/getCategories'
import { getProducts } from '../../../CallApi/ProductApi/getProducts'

function Product() {
    console.log('re-render-product')

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [products,setProducts] = useState([])
    const [productsSearch,setProductsSearch] = useState([])
    const [product,setProduct] = useState('')

    const [categories,setCategories] = useState([])
    const [categoryId,setCategoryId] = useState('')

    const [user, setUser] = useState(null);

    useEffect(() => {
        if(account) {
            setUser(account)
            if(account.role !== 'admin') {
                navigate('/Ql/AccessDenied')
            }
        }
    },[])

    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await getCategories(config);
            if (response && response.data) {
                setCategories(response.data);
            } else if (response && response.error === 'Unauthorized') {
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
                    const newDataResponse = await getCategories(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        setCategories(newDataResponse.data);
                    } else {
                        console.error('Error fetching categories after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching categories:');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataProducts = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await getProducts(config);
            if (response && response.data) {
                setProducts(response.data);
                setProductsSearch(response.data);
            } else if (response && response.error === 'Unauthorized') {
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
                    const newDataResponse = await getProducts(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        setProducts(newDataResponse.data);
                        setProductsSearch(newDataResponse.data);
                    } else {
                        console.error('Error fetching products after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching products:');
            }
        };
        fetchDataProducts();
    }, []);

    useEffect(() => {

        const searchProduct = product.toLowerCase();
        let filteredProducts = products;
    
        if (searchProduct && categoryId) {
            filteredProducts = products.filter(item => item.nameFood.toLowerCase().includes(searchProduct) && item.categoryId == categoryId);
        } else if (product) {
            filteredProducts = products.filter(item => item.nameFood.toLowerCase().includes(searchProduct));
        } else if (categoryId) {
            filteredProducts = products.filter(item => item.categoryId == categoryId);
        }
        setProductsSearch(filteredProducts);
    }, [product, categoryId]);
    
    
    console.log(product)
    console.log(products)
    console.log(productsSearch)

    console.log(categoryId)

    const classProductSearch = clsx(style.productSearch, 'input-group')
    const classProductButton = clsx(style.productButton, 'btn btn-outline-primary')
    const classProductIcon = clsx(style.productIcon)
    const classProductTable = clsx(style.productTable, 'table table-center')
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
                    }}
                />
                <button className={classProductButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classProductIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classProductButton} to='/Ql/Product/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classProductIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classProductTable}>
                <thead className="table-secondary">
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
                                        <Link to={`/Ql/Product/Edit/${item.foodId}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classProductTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Ql/Product/Delete/${item.foodId}`}>
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