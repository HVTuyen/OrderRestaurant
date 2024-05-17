import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API, CATEGORY_TITLE, CATEGORY_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { update } from 'firebase/database';
import { getCategory } from '../../../CallApi/CategoryApi/getCategory'
import { editCategory } from '../../../CallApi/CategoryApi/editCategory';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Update from '../../../component/crud/Update';

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

    return (
        <div className="col-10">
            <Update
                id={id}
                type={CATEGORY_TYPE}
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
            />
        </div>
    )
}

export default CategoryEdit;