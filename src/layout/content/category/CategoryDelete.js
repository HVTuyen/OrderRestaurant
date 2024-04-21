import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CATEGORY_API } from '../constants'

function CategoryDelete( ) {
    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')

    useEffect(() => {
        axios.get(`${CATEGORY_API}${id}`)
            .then(res => {
                setCategory(res.data)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [])

    const deleteCategory = async () => {
        axios.delete(`${CATEGORY_API}${id}`)
            .then(() => {
                console.log('Category deleted successfully');
                window.location.href = '/Category'; // Điều hướng về Category sau khi xóa
            })
            .catch(error => {
                console.error('Error delete category:', error);
            });
    }

    console.log(category)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <label className="col-sm-9 col-form-label">{category.categoryName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        {/* <label className="col-sm-9 col-form-label">{category.description}</label> */}
                        <label className="col-sm-9 col-form-label">
                            <img src={category.description} style={{maxWidth:'100%'}}/>    
                        </label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            to='/Category' 
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={deleteCategory}
                        >
                            Xác nhận xóa
                        </button>
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

export default CategoryDelete;