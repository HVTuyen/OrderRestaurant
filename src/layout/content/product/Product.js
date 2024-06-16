import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './product.module.scss'
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'
import { getCategories } from '../../../CallApi/CategoryApi/getCategories'
import { getProducts } from '../../../CallApi/ProductApi/getProducts'
import Pagination from '../../../component/Pagination/Pagination'

function Product() {
    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');
    const searchId = searchParams.get('id');
    const search = searchParams.get('search');

    const handleChangeSearchId = (e) => {
        sessionStorage.setItem('categoryId', e.target.value)
        setCategoryId(e.target.value)
    }

    const handleChangeSearch = (e) => {
        sessionStorage.setItem('searchFood', e.target.value)
        setProduct(e.target.value)
    }

    const [products, setProducts] = useState([])
    const [productsSearch, setProductsSearch] = useState([])
    const [product, setProduct] = useState(search || '')
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState(searchId || '')
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (account) {
            setUser(account)
            if (account.RoleName !== 'admin') {
                navigate('/Ql/AccessDenied')
            }
        }
    }, [])

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

    const fetchDataProducts = async () => {
        let data = {
            PageNumber: page,
            PageSize: pageSize
        }
        if (search?.length > 0) {
            data.search = search;
        }
        if (searchId?.length > 0) {
            data.categoryId = searchId;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await getProducts(config, data);
        if (response && response.data) {
            setProductsSearch(response.data.data);
            setTotalPages(response.data.totalPages)
        } else if (response && response.error === 'Data') {
            setProductsSearch([]);
            setTotalPages(0)
        } else {
            console.error('Error fetching products:');
        }
    };

    useEffect(() => {
        fetchDataProducts();
    }, [page, search, searchId]);

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
                    style={{ maxWidth: '180px' }}
                    className="form-select"
                    value={categoryId}
                    onChange={e => handleChangeSearchId(e)}
                >
                    <option value="">Chọn loại món ăn</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                    ))}
                </select>

                <input type="text" className="form-control" placeholder="Nhập tên món ăn cần tìm..."
                    value={product}
                    onChange={(e) => handleChangeSearch(e)}
                />
                <Link className={classProductButton}
                    to={`/Ql/Product?page=1&search=${product}&id=${categoryId}`}
                >
                    <FontAwesomeIcon icon={faSearch} className={classProductIcon} style={{ width: '100%' }} />
                </Link>
                <Link className={classProductButton} to='/Ql/Product/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classProductIcon} />
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
                                    <th className={classProductColId}>{(page - 1) * pageSize + index + 1}</th>
                                    <th className={classProductColImg}>
                                        <img loading='lazy' src={item.urlImage} alt={item.name} width="80" height="80" />
                                    </th>
                                    <td className={classProductColName}>{item.name}</td>
                                    <td className={classProductColPrice}>{item.unitPrice}</td>
                                    <td className={classProductColCategory}>{item.category.name}</td>
                                    <th className={classProductColAction}>
                                        <Link to={`/Ql/Product/Edit/${item.foodId}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classProductTableIcon} style={{ color: '#5c94ff' }} />
                                        </Link>
                                        <Link to={`/Ql/Product/Delete/${item.foodId}`}>
                                            <FontAwesomeIcon icon={faTrash} className={classProductTableIcon} style={{ color: '#ff5252' }} />
                                        </Link>
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Pagination
                url='Product'
                totalPages={totalPages}
                currentPage={page}
                search={search}
            />
        </div>
    )
}


export default Product;