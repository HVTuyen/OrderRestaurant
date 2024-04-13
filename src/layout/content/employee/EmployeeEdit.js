import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'


function EmployeeEdit( ) {
    const {id} = useParams()
    console.log(id)

    const [employee,setEmployee] = useState('')

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
            .then(res => res.json())
            .then(data => {
                setEmployee(data)
            })
    }, [])

    console.log(employee)
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa thông tin nhân viên</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên nhân viên</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" value={employee.title}/>
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="file" />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label"></label>
                        <label className="col-sm-9 col-form-label">
                            <img src={'https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSh-wrQu254qFaRcoYktJ5QmUhmuUedlbeMaQeaozAVD4lh4ICsGdBNubZ8UlMvWjKC'} alt={employee.title} style={{width:'25%', borderRadius:'8px'}}/>
                        </label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link to='/Employee' className='btn btn-outline-primary' style={{marginRight:'6px'}}>
                            Lưu
                        </Link>
                        <Link to='/Employee' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default EmployeeEdit;