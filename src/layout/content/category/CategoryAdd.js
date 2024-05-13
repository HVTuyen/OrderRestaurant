import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { createCategory } from '../../../CallApi/CategoryApi/createCategory';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';

function CategoryAdd( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    
    console.log(name,description)

    // const createCategory = () => {
    //     const newCategory = {
    //         categoryName: name,
    //         description: description,
    //     };
        
    //     axios.post(CATEGORY_API,newCategory)
    //     .then(() => {
    //         navigate('/Ql/Category');
    //     })
    //     .catch(error => {
    //         console.error('Error creating category:', error);
    //     });
    // }

    const handleCreate = async () => {
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
        const response = await createCategory(config, data);
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
                    const newDataResponse = await createCategory(newconfig, data);
                    if (newDataResponse && newDataResponse.data) {
                        navigate('/Ql/Category/')
                    } else {
                        console.error('Error create category after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error create category');
            }
    }

    // useEffect(() => {
    //     if (name && description) {
    //         createCategory();
    //     }
    // },[description]);
    
    return (
        <div className="col-10">
            <div className='title'>Thêm loại món</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên loại món ăn</label>
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

                    {/* <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <div className="col-sm-9">
                            <input 
                                type="file" 
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>
                    </div> */}
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={handleCreate}
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

export default CategoryAdd;