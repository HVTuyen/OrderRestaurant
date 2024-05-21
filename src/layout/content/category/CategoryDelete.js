import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CATEGORY_TITLE } from '../../constants'
import { getCategory } from '../../../CallApi/CategoryApi/getCategory'
import { deleteCategory } from '../../../CallApi/CategoryApi/deleteCategory'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Delete from '../../../component/crud/Delete'

function CategoryDelete() {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const { id } = useParams()
    console.log(id)

    const [category, setCategory] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

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
            const response = await getCategory(config, id);
            if (response && response.data) {
                setCategory(response.data);
                setName(response.data.categoryName)
                setDescription(response.data.description)
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
                        const newDataResponse = await getCategory(newconfig, id);
                        if (newDataResponse && newDataResponse.data) {
                            setCategory(newDataResponse.data);
                            setName(response.data.categoryName)
                            setDescription(response.data.description)
                        } else {
                            console.error('Error fetching categories after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                }
                else {
                    console.error('Error delete categories');
                }
            }
        };
        fetchData();
    }, []);

    const handleDataFromDelete = async (check) => {
        if (check) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await deleteCategory(config, id);
            if (response && !response.error) {
                navigate('/Ql/Category/')
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
                        const newDataResponse = await deleteCategory(newconfig, id);
                        if (newDataResponse) {
                            navigate('/Ql/Category/')
                        }
                        if (response && response.error === 'AccessDenied') {
                            navigate('/Ql/AccessDenied')
                        }
                        else {
                            console.error('Error delete category after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                }
                if (response && response.error === 'AccessDenied') {
                    navigate('/Ql/AccessDenied')
                }
                else {
                    console.error('Error delete category');
                }
            }
        }
    }

    console.log(category)

    return (
        <div className="col-10">
            <Delete
                url='/Ql/Category'
                title={CATEGORY_TITLE}
                item={
                    [
                        {
                            title: 'Tên loại món',
                            name: 'name',
                            value: name,
                            type: 'Text',
                        },
                        {
                            title: 'Mô tả',
                            name: 'description',
                            value: description,
                            type: 'Text',
                        }
                    ]
                }
                sendData={handleDataFromDelete}
            />
        </div>
    )
}

export default CategoryDelete;