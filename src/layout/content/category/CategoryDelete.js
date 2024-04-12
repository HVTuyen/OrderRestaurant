import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'


function CategoryDelete( ) {
    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setCategory(data)
            })
    }, [])

    console.log(category)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <label className="col-sm-9 col-form-label">{category.title}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <label className="col-sm-9 col-form-label">{category.body}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link to='/Category' className='btn btn-outline-danger' style={{marginRight:'6px'}}>
                            Xác nhận xóa
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

export default CategoryDelete;