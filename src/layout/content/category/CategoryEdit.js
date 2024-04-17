import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CATEGORY_API } from '../constants'

function CategoryEdit( ) {
    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')
    const [name,setName] = useState('')
    const [description,setDescription] = useState('')

    useEffect(() => {
        axios.get(`${CATEGORY_API}${id}`)
            .then(res => {
                setCategory(res.data)
                setName(res.data.categoryName)
                setDescription(res.data.description)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [])

    const updateCategory = async () => {
        const newCategory = {
            categoryName: name,
            description: description,
        };
        axios.put(`${CATEGORY_API}${id}`, newCategory)
            .then(() => {
                console.log('Category deleted successfully');
                window.location.href = '/Category'; // Điều hướng về Category sau khi xóa
            })
            .catch(error => {
                console.error('Error delete category:', error);
            });
    }

    console.log(category, name, description)
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
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
                            onClick={updateCategory}
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

export default CategoryEdit;