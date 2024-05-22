import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { PRODUCT_TITLE } from '../../constants'
import { getProduct } from '../../../CallApi/ProductApi/getProduct'
import { deleteProduct } from '../../../CallApi/ProductApi/deleteProduct'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Delete from '../../../component/crud/Delete'

function ProductDelete( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const searchFood = sessionStorage.getItem('searchFood');
    const categoryId = sessionStorage.getItem('categoryId');

    const {id} = useParams()
    console.log(id)

    const [product,setProduct] = useState('')

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
            const response = await getProduct(config, id);
            if (response && response.data) {
                setProduct(response.data);
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
                    const newDataResponse = await getProduct(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setProduct(newDataResponse.data);
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
            const response = await deleteProduct(config, id);
            if (response && !response.error) {
                navigate(`/Ql/Product?page=1&search=${searchFood}&id=${categoryId}`)
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
                        const newDataResponse = await deleteProduct(newconfig, id);
                        if (newDataResponse) {
                            navigate(`/Ql/Product?page=1&search=${searchFood}&id=${categoryId}`)
                        }
                        if (response && response.error === 'AccessDenied') {
                            navigate('/Ql/AccessDenied')
                        }
                        else {
                            console.error('Error delete Product after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                }
                if (response && response.error === 'AccessDenied') {
                    navigate('/Ql/AccessDenied')
                }
                else {
                    console.error('Error delete Product');
                }
            }
        }
    }

    console.log(product)
    
    return (
        <div className="col-10">
            <Delete
                url={`/Ql/Product?page=1&search=${searchFood}&id=${categoryId}`}
                title={PRODUCT_TITLE}
                item={
                    [
                        {
                            title: 'Tên món ăn',
                            name: 'name',
                            value: product.nameFood,
                            type: 'Text',
                        },
                        {
                            title: 'Đơn giá',
                            name: 'price',
                            value: product.unitPrice,
                            type: 'Text',
                        },
                        {
                            title: 'Loại món',
                            name: 'categoryId',
                            value: product.categoryId,
                            type: 'Select',
                        },
                        {
                            title: 'Ảnh',
                            name: 'image',
                            value: product.urlImage,
                            type: 'Image',
                        }
                    ]
                }
                sendData={handleDataFromDelete} 
            />
        </div>
    )
}

export default ProductDelete;