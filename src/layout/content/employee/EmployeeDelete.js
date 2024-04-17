import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { EMPLOYEE_API } from '../constants'

function EmployeeDelete( ) {
    const {id} = useParams()
    console.log(id)

    const [employee,setEmployee] = useState('')

    useEffect(() => {
        axios.get(`${EMPLOYEE_API}${id}`)
            .then(res => {
                setEmployee(res.data)
            })
            .catch(error => {
                console.error('Error fetching employee:', error);
            });
    }, [])

    const deleteEmployee = async () => {
        axios.delete(`${EMPLOYEE_API}${id}`)
            .then(() => {
                console.log('Empoyee deleted successfully');
                window.location.href = '/Employee'; // Điều hướng về Empoyee sau khi xóa
            })
            .catch(error => {
                console.error('Error delete Empoyee:', error);
            });
    }

    console.log(employee)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa nhân viên</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <img className="col-sm-4" src={`data:image/jpeg;base64,${employee.image}`} alt={employee.employeeName} height="100%"/>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên nhân viên</label>
                        <label className="col-sm-9 col-form-label">{employee.employeeName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Số điện thoại</label>
                        <label className="col-sm-9 col-form-label">{employee.phone}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Email</label>
                        <label className="col-sm-9 col-form-label">{employee.email}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link 
                            to='/Employee' 
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={deleteEmployee}
                        >
                            Xác nhận xóa
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

export default EmployeeDelete;