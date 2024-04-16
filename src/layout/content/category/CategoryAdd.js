import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CATEGORY_API } from '../constants'

function CategoryAdd( ) {

    const categoryApi = 'http://localhost:3001/category'

    const [name,setName] = useState('')
    const [description,setDescription] = useState('')

    console.log(name,description)

    const createCategory = () => {
        const newCategory = {
            categoryName: name,
            description: description,
        };
        
        axios.post(CATEGORY_API,newCategory)
    }
    
    return (
        <div className="col-10">
            <div className='title'>Thêm loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món ăn</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link 
                            to='/Category' 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={createCategory}
                        >
                            Lưu
                        </Link>
                        <Link to='/Category' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default CategoryAdd;