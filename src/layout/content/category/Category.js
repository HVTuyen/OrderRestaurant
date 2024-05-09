import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './category.module.scss'
import { CATEGORY_API, RENEW_TOKEN_API } from '../../constants'
import CategoryEdit from './CategoryEdit'
import { useAuth } from '../../../component/Context/AuthProvider';
import { decodeJWT } from '../../../Functions/decodeJWT'
import { renewToken} from '../../../CallApi/renewToken'


function Category({isrender}) {
    console.log('re-render-Category')

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [categories,setCategories] = useState([])
    const [categoriesSearch,setCategoriesSearch] = useState([])
    const [category,setCategory] = useState('')

    const [user, setUser] = useState(null);

    useEffect(() => {
        if(account) {
            setUser(account)
            if(account.role !== 'admin') {
                navigate('/ql')
            }
        }
    },[])

    console.log(user)

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        }
        axios.get(CATEGORY_API, config)
            .then(res => {
                setCategories(res.data);
                setCategoriesSearch(res.data);
            })
            .catch(async error => {
                if (error.response && error.response.status === 401) {
                    try {
                        const { accessToken, refreshToken } = await renewToken(oldtoken, navigate);
                        
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        reNewToken(accessToken, refreshToken)
                        // Gọi lại API với token mới
                        const newConfig = {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }
                        const response = await axios.get(CATEGORY_API, newConfig);
                        setCategories(response.data);
                        setCategoriesSearch(response.data);
                    } catch (error) {
                        console.error('Error fetching categories after token renewal:', error);
                    }
                } else {
                    console.error('Error fetching categories:', error);
                }
            });
    }, [])

    useEffect(() => {
        setCategoriesSearch(category ? categories.filter(item => item.categoryName.includes(category)) : categories);
    }, [category])
    
    console.log(category)
    console.log(categories)
    console.log(categoriesSearch)

    const classCategorySearch = clsx(style.categorySearch, 'input-group')
    const classCategoryButton = clsx(style.categoryButton, 'btn btn-outline-primary')
    const classCategoryIcon = clsx(style.categoryIcon)
    const classCategoryTable = clsx(style.categoryTable, 'table  table-center')
    const classCategoryColId = clsx(style.categoryCol, 'col-1')
    const classCategoryColName = clsx(style.categoryCol, 'col-4')
    const classCategoryColDes = clsx(style.categoryCol, 'col-6')
    const classCategoryColAction = clsx(style.categoryCol, 'col-1')
    const classCategoryTableIcon = clsx(style.categoryTableIcon)

    return (
        <div className="col-10">
            <div className='title'>Danh sách loại món ăn</div>
            <div className={classCategorySearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm..." 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
                <button className={classCategoryButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classCategoryIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classCategoryButton} to='/Ql/Category/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classCategoryIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classCategoryTable}>
                <thead className="table-secondary">
                    <tr>
                        <th className={classCategoryColId}>#</th>
                        <th className={classCategoryColName}>Tên loại</th>
                        <th className={classCategoryColDes}>Mô tả</th>
                        <th className={classCategoryColAction}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriesSearch?.map((item, index) => {
                            return (
                                <tr key={item.categoryId}>
                                    <th className={classCategoryColId}>{index + 1}</th>
                                    <td className={classCategoryColName}>{item.categoryName}</td>
                                    <td className={classCategoryColDes}>{item.description}</td>
                                    <th className={classCategoryColAction}>
                                        <Link to={`/Ql/Category/Edit/${item.categoryId}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classCategoryTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Ql/Category/Delete/${item.categoryId}`}>
                                            <FontAwesomeIcon icon={faTrash} className={classCategoryTableIcon} style={{color:'#ff5252'}}/>
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


export default Category;