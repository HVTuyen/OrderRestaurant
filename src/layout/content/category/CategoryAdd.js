import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API } from '../../constants'
import { storage } from '../../../firebaseConfig';

function CategoryAdd( ) {

    const navigate = useNavigate();

    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    
    console.log(name,description)
    
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
    //     // Đoạn code này để tạo tính năng lắng nghe quá trình tải ảnh, trả về tiến trình để làm tính năng phần trăm tải ảnh
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
    //         (error) => {
    //             // Xử lý trường hợp tải ảnh thất bại
    //         },
    //         () => {
    //             // Xử lý trường hợp tải ảnh thành công
    //             //  Lấy về đường link của ảnh vừa tải thành công
    //             getDownloadURL(uploadTask.snapshot.ref)
    //                 .then((downloadURL) => {
    //                     setDescription(downloadURL);
    //                     // reset các trạng thái sau khi tải ảnh thành công
    //                     setImage(null);
    //                     console.log('File available at', downloadURL);
    //                 });
    //         }
    //     );
    // }


    const createCategory = () => {
        const newCategory = {
            categoryName: name,
            description: description,
        };
        
        axios.post(CATEGORY_API,newCategory)
        .then(() => {
            navigate('/Ql/Category');
        })
        .catch(error => {
            console.error('Error creating category:', error);
        });
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
                            onClick={createCategory}
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