import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './qlorder.module.scss'


function Qlorder({isrender}) {
    console.log('re-render-Category')
    const [categories,setCategories] = useState([])
    const [categoriesSearch,setCategoriesSearch] = useState([])
    const [category,setCategory] = useState('')

    const classQlorderSearch = clsx(style.qlorderSearch, 'input-group')
    const classQlorderButton = clsx(style.qlorderButton, 'btn btn-outline-primary')
    const classQlorderIcon = clsx(style.qlorderIcon)
    const classQlorderTable = clsx(style.qlorderTable, 'table')
    const classQlorderColId = clsx(style.qlorderCol, 'col-1')
    const classQlorderColName = clsx(style.qlorderCol, 'col-4')
    const classQlorderColDes = clsx(style.qlorderCol, 'col-6')
    const classQlorderColAction = clsx(style.qlorderCol, 'col-1')
    const classQlorderTableIcon = clsx(style.qlorderTableIcon)

    return (
        <div className="col-10">
            <div className='title'>Danh sách loại món ăn</div>
            <div className={classQlorderSearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm..." 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
                <button className={classQlorderButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classQlorderIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classQlorderButton} to='/Category/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classQlorderIcon}/>
                    Thêm
                </Link>
            </div>

            <table className={classQlorderTable}>
                <thead>
                    <tr>
                        <th className={classQlorderColId}>#</th>
                        <th className={classQlorderColName}>Tên loại</th>
                        <th className={classQlorderColDes}>Mô tả</th>
                        <th className={classQlorderColAction}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriesSearch?.map((item, index) => {
                            return (
                                <tr key={item.categoryId}>
                                    <th className={classQlorderColId}>{index + 1}</th>
                                    <td className={classQlorderColName}>{item.categoryName}</td>
                                    <td className={classQlorderColDes}>{item.description}</td>
                                    <th className={classQlorderColAction}>
                                        <Link to={`/Category/Edit/${item.categoryId}`}>
                                            <FontAwesomeIcon icon={faEdit} className={classQlorderTableIcon} style={{color:'#5c94ff'}}/>
                                        </Link>
                                        <Link to={`/Category/Delete/${item.categoryId}`}>
                                            <FontAwesomeIcon icon={faTrash} className={classQlorderTableIcon} style={{color:'#ff5252'}}/>
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


export default Qlorder;