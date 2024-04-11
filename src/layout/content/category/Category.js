import clsx from 'clsx'
import { useReducer, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'

import style from './category.module.scss'
import reducer, {initState} from './reducer'
import { setCategories, setCategory } from './actions'

function Category() {
    console.log('re-render')

    const [state, dispatch] = useReducer(reducer, initState)
    const { category, categories, categoriessearch} = state

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => dispatch(setCategories(data)))
    }, [])
    

    const classCategorySearch = clsx(style.categorySearch, 'input-group')
    const classCategoryButton = clsx(style.categoryButton, 'btn btn-outline-primary')
    const classCategoryIcon = clsx(style.categoryIcon)
    const classCategoryTable = clsx(style.categoryTable, 'table')
    const classCategoryPagination = clsx(style.categoryPagination, 'pagination justify-content-center')

    console.log(categoriessearch)
    return (
        <div className="col-10">
            <div className={classCategorySearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm..." 
                    value={category}
                    onChange={ e => {
                        dispatch(setCategory(e.target.value))
                    }}        
                />
                <button className={classCategoryButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classCategoryIcon}/>
                    Tìm kiếm
                </button>
                <button className={classCategoryButton} type="button">
                    <FontAwesomeIcon icon={faPlus} className={classCategoryIcon}/>
                    Thêm
                </button>
            </div>


            <table className={classCategoryTable}>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên loại</th>
                        <th scope="col">Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriessearch.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row" style={{minWidth:48}}>{index + 1}</th>
                                    <td>{item.title}</td>
                                    <td>{item.body}</td>
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