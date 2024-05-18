import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { EMPLOYEE_TITLE } from '../../constants'
import { getEmployee } from '../../../CallApi/EmployeeApi/getEmployee'
import { deleteEmployee } from '../../../CallApi/EmployeeApi/deleteEmployee'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Delete from '../../../component/crud/Delete'

// function EmployeeDelete( ) {

//     const navigate = useNavigate();

//     const {id} = useParams()
//     console.log(id)

//     const [employee,setEmployee] = useState('')

//     useEffect(() => {
//         axios.get(`${EMPLOYEE_API}${id}`)
//             .then(res => {
//                 setEmployee(res.data)
//             })
//             .catch(error => {
//                 console.error('Error fetching employee:', error);
//             });
//     }, [])

//     const deleteEmployee = async () => {
//         axios.delete(`${EMPLOYEE_API}${id}`)
//             .then(() => {
//                 console.log('Empoyee deleted successfully');
//                 navigate('/Ql/Employee')
//             })
//             .catch(error => {
//                 console.error('Error delete Empoyee:', error);
//             });
//     }

//     console.log(employee)
    
//     return (
//         <div className="col-10">
//             <div className='title'>Xóa nhân viên</div>
//             <div className='row'>
//                 <div className='col-2'></div>
//                 <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Ảnh</label>
//                         <img className="col-sm-4" src={employee.image} alt={employee.employeeName} height="100%"/>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Tên nhân viên</label>
//                         <label className="col-sm-9 col-form-label">{employee.employeeName}</label>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Số điện thoại</label>
//                         <label className="col-sm-9 col-form-label">{employee.phone}</label>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Email</label>
//                         <label className="col-sm-9 col-form-label">{employee.email}</label>
//                     </div>
//                     <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
//                         <button 
//                             className='btn btn-outline-danger' 
//                             style={{marginRight:'6px'}}
//                             onClick={deleteEmployee}
//                         >
//                             Xác nhận xóa
//                         </button>
//                         <Link to='/Ql/Employee' className='btn btn-outline-danger'>
//                             Trở về
//                         </Link>
//                     </div>
//                 </div>
//                 <div className='col-2'></div>
//             </div>
//         </div>
//     )
// }

function EmployeeDelete( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const [employee,setEmployee] = useState({})

    useEffect(() => {
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
            const response = await getEmployee(config, id);
            if (response && response.data) {
                setEmployee(response.data);
            } else if (response && response.error === 'Unauthorized') {
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
                    const newDataResponse = await getEmployee(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setEmployee(newDataResponse.data);
                    } else {
                        console.error('Error fetching empolyee after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching empolyee:', response.error || 'Unknown error');
            }
        };
        fetchData();
    }, []);

    const handleDataFromDelete = async (check) => {
        if(check) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await deleteEmployee(config, id);
            if (response) {
                navigate('/Ql/Employee/')
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
                        const newDataResponse = await deleteEmployee(newconfig, id);
                        if (newDataResponse) {
                            navigate('/Ql/Employee/')
                        } else {
                            console.error('Error delete Employee after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                } else {
                    console.error('Error delete Employee');
                }
            }
        }
    }
    
    return (
        <div className="col-10">
            <Delete
                url='/Ql/Employee'
                title={EMPLOYEE_TITLE}
                item={
                    [
                        {
                            title: 'Tên nhân viên',
                            name: 'name',
                            value: employee.employeeName,
                            type: 'Text',
                        },
                        {
                            title: 'Số điện thoại',
                            name: 'phone',
                            value: employee.phone,
                            type: 'Text',
                        },
                        {
                            title: 'Email',
                            value: employee.email,
                            name: 'email',
                            type: 'Text',
                        },
                        {
                            title: 'Mật khẩu',
                            name: 'password',
                            value: employee.password,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh',
                            name: 'image',
                            value: employee.image,
                            type: 'Image',
                        }
                    ]
                }
                sendData={handleDataFromDelete} 
            />
        </div>
    )
}

export default EmployeeDelete;