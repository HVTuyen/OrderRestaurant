import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API,  CATEGORY_TITLE} from '../../constants'
import { storage } from '../../../firebaseConfig';
import { createCategory } from '../../../CallApi/CategoryApi/createCategory';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';

import Create from '../../../component/crud/Create';

function CategoryAdd( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();


    const handleDataFromCreate = async ( formData ) => {
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
            categoryName: formData.name,
            description: formData.description,
        }
        const response = await createCategory(config, data);
        if (response && response.data) {
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
    };

    return (
        <div className="col-10">

            <Create
                url='/Ql/Category'
                title={CATEGORY_TITLE}
                item={
                    [
                        {
                            title: 'Tên loại món',
                            name: 'name',
                            type: 'Text',
                        },
                        {
                            title: 'Mô tả',
                            name: 'description',
                            type: 'Text',
                        }
                    ]
                }
                sendData={handleDataFromCreate} 
            />
        </div>
    )
}

export default CategoryAdd;