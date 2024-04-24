import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { update } from 'firebase/database';

function CategoryEdit( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [category,setCategory] = useState('')
    const [name,setName] = useState('')
    const [description,setDescription] = useState('')


    // const [isUpload,setIsUpload] = useState('')
    // const [image, setImage] = useState(null);
    // const handleChange = (e) => {
    //     if (e.target.files[0]) {
    //         setImage(e.target.files[0]);
    //     }
    // };
    // const metadata = {
    //     contentType: 'image/jpeg',
    // };
    // const handleUpload = () => {
	// 	const storageRef = ref(storage, `images/${image.name}`); // tạo 1 địa chỉ để chứa ảnh chuẩn bị tải lên store
    //     const uploadTask = uploadBytesResumable(storageRef, image, metadata); // hàm tải ảnh lên store 
    //     uploadTask.on(
    //         'state_changed',
    //         (snapshot) => {
    //             switch (snapshot.state) {
    //                 case 'paused':
    //                     console.log('Upload is paused');
    //                     break;
    //                 case 'running':
    //                     console.log('Upload is running');
    //                     break;
    //             }
    //         },
    //         () => {
    //             getDownloadURL(uploadTask.snapshot.ref)
    //                 .then((downloadURL) => {
    //                     setDescription(downloadURL);
    //                     setIsUpload('true')
    //                     setImage(null);
    //                     console.log('File available at', downloadURL);
    //                 });
    //         }
    //     );
    // }
    // const handleUpdate = () => {
    //     if(image!=null) {
    //         handleUpload()
    //     }
    //     else {
    //         updateCategory()
    //     }
    // }
    // useEffect(() => {
    //     if (name && description) {
    //         updateCategory();
    //     }
    // },[isUpload]);


    useEffect(() => {
        axios.get(`${CATEGORY_API}${id}`)
            .then(res => {
                setCategory(res.data)
                setName(res.data.categoryName)
                setDescription(res.data.description)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [])

    const updateCategory = async () => {
        const newCategory = {
            categoryName: name,
            description: description,
        };
        axios.put(`${CATEGORY_API}${id}`, newCategory)
            .then(() => {
                console.log('Category deleted successfully');
                navigate('/Ql/Category');
            })
            .catch(error => {
                console.error('Error delete category:', error);
            });
    }

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

                    {/* <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mô tả</label>
                        <div className="col-sm-9">
                            <input 
                                type="file" 
                                className="form-control"
                                onChange={handleChange}
                            />
                            <img src={description} style={{maxWidth:'100%'}}/>    
                        </div>
                    </div> */}

                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={updateCategory}
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