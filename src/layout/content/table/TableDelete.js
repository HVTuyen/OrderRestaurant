import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { TABLE_TITLE } from '../../constants'
import { getTable } from '../../../CallApi/TableApi/getTable'
import { deleteTable } from '../../../CallApi/TableApi/deleteTable'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Delete from '../../../component/crud/Delete'

function TableDelete( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const [table,setTable] = useState('')

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
            const response = await getTable(config, id);
            if (response && response.data) {
                setTable(response.data);
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
                    const newDataResponse = await getTable(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setTable(newDataResponse.data);
                    } else {
                        console.error('Error fetching table after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching table:', response.error || 'Unknown error');
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
            const response = await deleteTable(config, id);
            if (response && !response.error) {
                navigate('/Ql/Table/')
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
                        const newDataResponse = await deleteTable(newconfig, id);
                        if (newDataResponse) {
                            navigate('/Ql/Table/')
                        }
                        if (response && response.error === 'AccessDenied') {
                            navigate('/Ql/AccessDenied')
                        }
                        else {
                            console.error('Error delete Table after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                }
                if (response && response.error === 'AccessDenied') {
                    navigate('/Ql/AccessDenied')
                }
                else {
                    console.error('Error delete Table');
                }
            }
        }
    }
    
    return (
        <div className="col-10">
            <Delete
                url='/Ql/Table'
                title={TABLE_TITLE}
                item={
                    [
                        {
                            title: 'Tên bàn',
                            name: 'name',
                            value: table.name,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh QR',
                            name: 'image',
                            value: table.urlImage,
                            type: 'Image',
                        }
                    ]
                }
                sendData={handleDataFromDelete} 
            />
        </div>
    )
}

export default TableDelete;