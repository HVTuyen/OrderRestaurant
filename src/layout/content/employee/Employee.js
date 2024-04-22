import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './employee.module.scss'
import { EMPLOYEE_API } from '../constants'

function Employee() {
    console.log('re-render-Employee')
    const [employees,setEmployees] = useState([])
    const [employeesSearch,setEmployeesSearch] = useState([])
    const [employee,setEmployee] = useState('')

    useEffect(() => {
        axios.get(EMPLOYEE_API)
            .then(res => {
                setEmployees(res.data);
                setEmployeesSearch(res.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, [])


    useEffect(() => {
        setEmployeesSearch(employee ? employees.filter(item => item.employeeName.includes(employee)) : employees);
    }, [employee])
    
    console.log(employee)
    console.log(employees)
    console.log(employeesSearch)

    const classEmployeeSearch = clsx(style.employeeSearch, 'input-group')
    const classEmployeeButton = clsx(style.employeeButton, 'btn btn-outline-primary')
    const classEmployeeIcon = clsx(style.employeeIcon)
    const classEmployeeItemIcon = clsx(style.employeeItemIcon)
    const classEmployeeText = clsx(style.employeeText)


    return (
        <div className="col-10">
            <div className='title'>Danh sách nhân viên</div>
            <div className={classEmployeeSearch}>
                <input type="text" className="form-control" placeholder="Nhập tên nhân viên cần tìm..." 
                    value={employee}
                    onChange={e => setEmployee(e.target.value)}
                />
                <button className={classEmployeeButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classEmployeeIcon} style={{width: '100%'}}/>
                </button>
                <Link className={classEmployeeButton} to='/Employee/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classEmployeeIcon}/>
                    Thêm
                </Link>
            </div>

            <div className='row'>
                <div className='col-1'>

                </div>
                <div className='col-10'>
                    <div className='row' style={{marginBottom:'24px'}}>
                        {
                            employeesSearch?.map((item) => {
                                return (
                                    <div key={item.employeeId} className='col-6' style={{padding:'24px 12px 8px 12px'}}>
                                        <div className='border d-flex a-center' style={{}}>
                                            <div className='col-3' style={{padding:'6px'}}>
                                                <img src={item.image} alt={item.title} style={{width:'100%',height:'100%', maxHeight:'150px', borderRadius:'8px', border:'1px solid #ccc'}}/>
                                            </div>
                                            <div className='col-9'>
                                                <div style={{padding:'8px 8px 8px 0'}}>
                                                    <div className={classEmployeeText} >
                                                        Tên: {item.employeeName}
                                                    </div>
                                                    <div className={classEmployeeText} >
                                                        SĐT: {item.phone}
                                                    </div>
                                                    <div className={classEmployeeText} >
                                                        Email: {item.email}
                                                    </div>
                                                </div>
                                                <div className='d-flex j-flex-end'>
                                                    <Link to={`/Employee/Edit/${item.employeeId}`}>
                                                        <FontAwesomeIcon icon={faEdit} className={classEmployeeItemIcon} style={{color:'#5c94ff'}}/>
                                                    </Link>
                                                    <Link to={`/Employee/Delete/${item.employeeId}`}>
                                                        <FontAwesomeIcon icon={faTrash} className={classEmployeeItemIcon} style={{color:'#ff5252'}}/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='col-1'>

                </div>
            </div>

        </div>
    )
}


export default Employee;