import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { PRODUCT_API, CATEGORY_API } from '../constants'

function ProductEdit( ) {
    const {id} = useParams()
    console.log(id)

    const [nameFood,setNameFood] = useState('')
    const [unitPrice,setUnitPrice] = useState('')
    const [urlImage,setUrlImage] = useState('')
    const [previewImg,setPreviewImg] = useState('')
    const [categoryId,setCategoryId] = useState('')

    const [categories,setCategories] = useState([])

    useEffect(() => {
        axios.get(`${PRODUCT_API}${id}`)
            .then(res => {
                setNameFood(res.data.nameFood)
                setUnitPrice(res.data.unitPrice)
                setPreviewImg(res.data.urlImage)
                setCategoryId(res.data.categoryId)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [])
    
    useEffect(() => {
        axios.get(CATEGORY_API)
            .then(res => {
                setCategories(res.data)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [])
    console.log(categories)

    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])

    const handleImg = (e) => {
        const img = e.target.files[0]
        setUrlImage(img)
        img.preview = URL.createObjectURL(img)
        setPreviewImg(img)
    }

    const updateProduct = async () => {
        const formData = new FormData();
        formData.append('nameFood', nameFood);
        formData.append('unitPrice', unitPrice);
        formData.append('categoryId', categoryId);
        formData.append('image', urlImage);

        try {
            await axios.put(`${PRODUCT_API}${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Product update successfully.');
            window.location.href = '/Product';
        } catch (error) {
            console.error('Error update product:', error);
            // Handle error
        }
    }
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa món ăn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên món ăn</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={nameFood}
                                onChange={e => setNameFood(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Đơn giá</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={unitPrice}
                                onChange={e => setUnitPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Loại món ăn</label>
                        <div className="col-sm-9">
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                            >
                                <option value="">Chọn loại món ăn</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <div className="col-sm-6">
                            <input 
                                type="file" 
                                className="form-control"    
                                onChange={handleImg}
                            />
                        </div>
                        <div className="col-sm-3">
                            {previewImg && (
                                <img src={urlImage=='' ? `data:image/jpeg;base64,${previewImg}` : previewImg.preview} style={{width: '100%', height: '100%'}}/>
                            )}
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link 
                            to='/Product' 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={updateProduct}
                        >
                            Lưu
                        </Link>
                        <Link to='/Product' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default ProductEdit;