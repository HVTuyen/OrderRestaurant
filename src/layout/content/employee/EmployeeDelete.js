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
            if (response && !response.error) {
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
                        }
                        if (response && response.error === 'AccessDenied') {
                            navigate('/Ql/AccessDenied')
                        }
                        else {
                            console.error('Error delete Employee after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                }
                if (response && response.error === 'AccessDenied') {
                    navigate('/Ql/AccessDenied')
                }
                else {
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