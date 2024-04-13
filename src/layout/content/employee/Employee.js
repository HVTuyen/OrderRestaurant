import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './employee.module.scss'
import { height, width } from '@fortawesome/free-brands-svg-icons/fa42Group'

function Employee() {
    console.log('re-render-Employee')
    const [employees,setEmployees] = useState([])
    const [employeesSearch,setEmployeesSearch] = useState([])
    const [employee,setEmployee] = useState('')

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(data => {
                setEmployees(data.slice(0, 9))
                setEmployeesSearch(data.slice(0, 9))
            })
    }, [])

    useEffect(() => {
        setEmployeesSearch(employee ? employees.filter(item => item.title.includes(employee)) : employees);
    }, [employee])
    
    console.log(employee)
    console.log(employees)
    console.log(employeesSearch)

    const classEmployeeSearch = clsx(style.employeeSearch, 'input-group')
    const classEmployeeButton = clsx(style.employeeButton, 'btn btn-outline-primary')
    const classEmployeeIcon = clsx(style.employeeIcon)
    const classEmployeeItemIcon = clsx(style.employeeItemIcon)

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
                            employeesSearch.map((item) => {
                                return (
                                    <div className='col-4' style={{padding:'24px 12px 8px 12px'}}>
                                        <div className='border d-flex' style={{}}>
                                            <div className='col-4'>
                                                <img src={'https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSh-wrQu254qFaRcoYktJ5QmUhmuUedlbeMaQeaozAVD4lh4ICsGdBNubZ8UlMvWjKC'} alt={item.title} style={{width:'100%', borderRadius:'8px'}}/>
                                            </div>
                                            <div className='col-8'>
                                                <div style={{padding:'8px 8px 0 0'}}>
                                                    <div style={{borderBottom:'1px solid #333'}}>
                                                        Tên: 
                                                    </div>
                                                    <div style={{borderBottom:'1px solid #333'}}>
                                                        SĐT: 
                                                    </div>
                                                    <div style={{borderBottom:'1px solid #333'}}>
                                                        Email: 
                                                    </div>
                                                </div>
                                                <div className='d-flex j-flex-end'>
                                                    <Link to={`/Employee/Edit/${item.id}`}>
                                                        <FontAwesomeIcon icon={faEdit} className={classEmployeeItemIcon} style={{color:'#5c94ff'}}/>
                                                    </Link>
                                                    <Link to={`/Employee/Delete/${item.id}`}>
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