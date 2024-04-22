import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { EMPLOYEE_API } from '../constants'
import { storage } from '../../../firebaseConfig';

function EmployeeEdit( ) {
    const {id} = useParams()
    console.log(id)

    const [employeeName,setEmployeeName] = useState('')
    const [phone,setPhone] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [urlImage,setUrlImage] = useState('')
    const [previewImg,setPreviewImg] = useState('')

    //Xử lí ảnh
    const [isUpload,setIsUpload] = useState(false)
    const [image, setImage] = useState(null);
    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])
    const handleChange = (e) => {
        const img = e.target.files[0]
        if (img) {
            setImage(img);
            img.preview = URL.createObjectURL(img)
            setPreviewImg(img)
        }
    };
    const metadata = {
        contentType: 'image/jpeg',
    };
    const handleUpload = () => {
		const storageRef = ref(storage, `images/${image.name}`); // tạo 1 địa chỉ để chứa ảnh chuẩn bị tải lên store
        const uploadTask = uploadBytesResumable(storageRef, image, metadata); // hàm tải ảnh lên store 
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (err) => {
                
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setUrlImage(downloadURL);
                        setIsUpload(true)
                        setImage(null);
                        console.log('File available at', downloadURL);
                    });
            }
        );
    }
    const handleUpdate = () => {
        if(image!=null) {
            handleUpload()
        }
        else {
            updateEmployee()
        }
    }
    useEffect(() => {
        if (urlImage) {
            updateEmployee();
        }
    },[isUpload]);

    useEffect(() => {
        axios.get(`${EMPLOYEE_API}${id}`)
            .then(res => {
                setEmployeeName(res.data.employeeName)
                setPhone(res.data.phone)
                setEmail(res.data.email)
                setPassword(res.data.password)
                setUrlImage(res.data.image)
            })
            .catch(error => {
                console.error('Error fetching table:', error);
            });
    }, [])

    const updateEmployee = async () => {
        const newEmployee = {
            employeeName: employeeName,
            phone: phone,
            email: email,
            password: password,
            image: urlImage,
        };
        
        axios.put(`${EMPLOYEE_API}${id}`,newEmployee)
        .then(() => {
            window.location.href = '/Employee';
        })
        .catch(error => {
            console.error('Error creating Employee:', error);
        });
    }
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa thông tin nhân viên</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên nhân viên</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={employeeName}
                                onChange={e => setEmployeeName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Số điện thoại</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Email</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Mật khẩu</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <div className="col-sm-6">
                            <input 
                                type="file" 
                                className="form-control"    
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-sm-3">
                            <img src={previewImg?previewImg.preview:urlImage} style={{width: '100%', height: '100%'}}/>
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            to='/Employee' 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={handleUpdate}
                        >
                            Lưu
                        </button>
                        <Link to='/Employee' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default EmployeeEdit;