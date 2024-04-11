import clsx from 'clsx'
import { useReducer } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'

import style from './category.module.scss'
import reducer, {initState} from './reducer'
import { setCategories } from './actions'

function Category() {

    const [state, dispatch] = useReducer(reducer, initState)
    const { category, categories} = state
    

    const classCategorySearch = clsx(style.categorySearch, 'input-group')
    const classCategoryButton = clsx(style.categoryButton, 'btn btn-outline-primary')
    const classCategoryIcon = clsx(style.categoryIcon)
    const classCategoryTable = clsx(style.categoryTable, 'table')
    const classCategoryPagination = clsx(style.categoryPagination, 'pagination justify-content-center')

    return (
        <div className="col-10">
            <div className={classCategorySearch}>
                <input type="text" className="form-control" placeholder="Nhập loại món ăn cần tìm...    " />
                <button className={classCategoryButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classCategoryIcon}/>
                    Tìm kiếm
                </button>
                <button className={classCategoryButton} type="button">
                    <FontAwesomeIcon icon={faPlus} className={classCategoryIcon}/>
                    Thêm
                </button>
            </div>


            <table class={classCategoryTable}>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên loại</th>
                        <th scope="col">Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry the Bird</td>
                        <td>Thornton</td>
                    </tr>
                </tbody>
            </table>

            <ul class={classCategoryPagination}>
                <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </div>
    )
}

export default Category;