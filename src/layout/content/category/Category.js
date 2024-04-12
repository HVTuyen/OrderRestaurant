import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './category.module.scss'

function Category() {
    console.log('re-render-Category')
    const [categorys,setCategorys] = useState([])
    const [categoriesSearch,setCategoriesSearch] = useState([])
    const [category,setCategory] = useState('')

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setCategorys(data)
                setCategoriesSearch(data)
            })
    }, [])

    useEffect(() => {
        setCategoriesSearch(Category ? categorys.filter(item => item.title.includes(category)) : categorys);
    }, [category])
    
    console.log(category)
    console.log(categorys)
    console.log(categoriesSearch)

    const classCategorySearch = clsx(style.categorySearch, 'input-group')
    const classCategoryButton = clsx(style.categoryButton, 'btn btn-outline-primary')
    const classCategoryIcon = clsx(style.categoryIcon)
    const classCategoryTable = clsx(style.categoryTable, 'table')
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
                <Link className={classCategoryButton} to='/Category/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classCategoryIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classCategoryTable}>
                <thead>
                    <tr>
                        <th className={classCategoryColId}>#</th>
                        <th className={classCategoryColName}>Tên loại</th>
                        <th className={classCategoryColDes}>Mô tả</th>
                        <th className={classCategoryColAction}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriesSearch.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <th className={classCategoryColId}>{item.id}</th>
                                    <td className={classCategoryColName}>{item.title}</td>
                                    <td className={classCategoryColDes}>{item.body}</td>
                                    <th className={classCategoryColAction}>
                                        <Link to={`/Category/Edit/${item.id}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classCategoryTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Category/Delete/${item.id}`}>
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