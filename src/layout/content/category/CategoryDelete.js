import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CATEGORY_API } from '../../constants'
import { getCategory } from '../../../CallApi/CategoryApi/getCategory'
import { deleteCategory } from '../../../CallApi/CategoryApi/deleteCategory'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';

function CategoryDelete( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')

    // useEffect(() => {
    //     axios.get(`${CATEGORY_API}${id}`)
    //         .then(res => {
    //             setCategory(res.data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching categories:', error);
    //         });
    // }, [])

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
                    const newDataResponse = await getCategory(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setCategory(newDataResponse.data);
                    } else {
                        console.error('Error fetching categories after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching categories:', response.error || 'Unknown error');
            }
        };
        fetchData();
    }, []);

    // const deleteCategory = async () => {
    //     axios.delete(`${CATEGORY_API}${id}`)
    //         .then(() => {
    //             console.log('Category deleted successfully');
    //         })
    //         .then(() => {
    //             navigate('/Ql/Category');
    //         })
    //         .catch(error => {
    //             console.error('Error delete category:', error);
    //         });
    // }

    const handleDelete = async () => {
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
        if (response && response.data) {
            navigate('/Ql/Category/')
        } else 
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
                    if (newDataResponse && newDataResponse.data) {
                        navigate('/Ql/Category/')
                    } else {
                        console.error('Error delete category after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                navigate('/Ql/Category/')
            }
    }

    console.log(category)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <label className="col-sm-9 col-form-label">{category?.categoryName}</label>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <label className="col-sm-9 col-form-label">{category?.description}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={handleDelete}
                        >
                            Xác nhận xóa
                        </button>
                        <Link to='/Ql/Category' className='btn btn-outline-danger'>
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