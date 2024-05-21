import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './employee.module.scss'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import { getEmployees } from '../../../CallApi/EmployeeApi/getEmployees'

function Employee() {
    console.log('re-render-Employee')

    const { account, token, refreshToken, reNewToken } = useAuth();

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([])
    const [employeesSearch, setEmployeesSearch] = useState([])
    const [employee, setEmployee] = useState('')

    const [user, setUser] = useState(null);

    useEffect(() => {
        if(account) {
            setUser(account)
            if(account.role !== 'admin') {
                navigate('/Ql/AccessDenied')
            }
        }
    },[])

    const fetchData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await getEmployees(config);
        if (response && response.data) {
            setEmployees(response.data);
            setEmployeesSearch(response.data);
        } else {
            if (response && response.error === 'Unauthorized') {
                try {
                    const { accessToken, refreshToken } = await renewToken(oldtoken, navigate);
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    reNewToken(accessToken, refreshToken);
                    const newconfig = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    const newDataResponse = await getEmployees(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        setEmployees(newDataResponse.data);
                        setEmployeesSearch(newDataResponse.data);
                    } else {
                        console.error('Error fetch employee after renewing token');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            }
            if (response && response.error === 'AccessDenied') {
                navigate('/Ql/AccessDenied');
            } else {
                console.error('Error fetching employee');
            }
        }
    };

    useEffect(() => {
        if(user && user.role === 'admin') {
            fetchData();
        }
    }, [user])


    useEffect(() => {
        const searchEmployee = employee.toLowerCase();
        const filteredEmployees = employees.filter(item => item.employeeName.toLowerCase().includes(searchEmployee));
        
        setEmployeesSearch(filteredEmployees);
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
                    <FontAwesomeIcon icon={faSearch} className={classEmployeeIcon} style={{ width: '100%' }} />
                </button>
                <Link className={classEmployeeButton} to='/Ql/Employee/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classEmployeeIcon} />
                    Thêm
                </Link>
            </div>

            <div className='row'>
                <div className='col-lg-1 col-xs-0'>

                </div>
                <div className='col-10'>
                    <div className='row' style={{ marginBottom: '24px' }}>
                        {
                            employeesSearch?.map((item) => {
                                return (
                                    <div key={item.employeeId} className='col-lg-6 col-xs-12' style={{ padding: '24px 12px 8px 12px' }}>
                                        <div className='border d-flex a-center' style={{}}>
                                            <div className='col-3' style={{ padding: '6px' }}>
                                                <img loading='lazy' src={item.image} alt={item.title} style={{ width: '100%', height: '100%', maxHeight: '150px', borderRadius: '8px', border: '1px solid #ccc' }} />
                                            </div>
                                            <div className='col-9'>
                                                <div style={{ padding: '8px 8px 8px 0' }}>
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
                                                    <Link to={`/Ql/Employee/Edit/${item.employeeId}`}>
                                                        <FontAwesomeIcon icon={faEdit} className={classEmployeeItemIcon} style={{ color: '#5c94ff' }} />
                                                    </Link>
                                                    <Link to={`/Ql/Employee/Delete/${item.employeeId}`}>
                                                        <FontAwesomeIcon icon={faTrash} className={classEmployeeItemIcon} style={{ color: '#ff5252' }} />
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
                <div className='col-lg-1 col-xs-0'>

                </div>
            </div>

        </div>
    )
}


export default Employee;