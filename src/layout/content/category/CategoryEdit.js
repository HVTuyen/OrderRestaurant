import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { update } from 'firebase/database';
import { getCategory } from '../../../CallApi/CategoryApi/getCategory'
import { editCategory } from '../../../CallApi/CategoryApi/editCategory';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';

function CategoryEdit( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')
    const [name,setName] = useState('')
    const [description,setDescription] = useState('')

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
                        setName(newDataResponse.data.categoryName)
                        setDescription(newDataResponse.data.description)
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
    
    // useEffect(() => {
    //     axios.get(`${CATEGORY_API}${id}`)
    //         .then(res => {
    //             setCategory(res.data)
    //             setName(res.data.categoryName)
    //             setDescription(res.data.description)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching categories:', error);
    //         });
    // }, [])

    const handleUpdate = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const data = {
            categoryName: name,
            description: description,
        }
        const response = await editCategory(config, id, data);
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
                    const newDataResponse = await editCategory(newconfig, id, data);
                    if (newDataResponse && newDataResponse.data) {
                        navigate('/Ql/Category/')
                    } else {
                        console.error('Error delete category after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                // navigate('/Ql/Category/')
            }
    }

    // const updateCategory = async () => {
    //     const newCategory = {
    //         categoryName: name,
    //         description: description,
    //     };
    //     axios.put(`${CATEGORY_API}${id}`, newCategory)
    //         .then(() => {
    //             console.log('Category deleted successfully');
    //             navigate('/Ql/Category');
    //         })
    //         .catch(error => {
    //             console.error('Error delete category:', error);
    //         });
    // }

    console.log(category, name, description)
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={handleUpdate}
                        >
                            Lưu
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

export default CategoryEdit;