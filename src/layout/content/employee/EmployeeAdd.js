import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { EMPLOYEE_API } from '../constants'

function EmployeeAdd( ) {

    const [employeeName,setEmployeeName] = useState('')
    const [phone,setPhone] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [image,setImage] = useState('')
    const [previewImg,setPreviewImg] = useState('')

    console.log(employeeName,phone, email, password, image)

    const createEmployee = async () => {
        const formData = new FormData();
        formData.append('employeeName', employeeName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);

        try {
            await axios.post(`${EMPLOYEE_API}postEmployee`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Employee created successfully.');
            // Redirect or handle success
        } catch (error) {
            console.error('Error creating Employee:', error);
            // Handle error
        }
    };

    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])

    const handleImg = (e) => {
        const img = e.target.files[0]
        console.log(typeof img)
        setImage(img)
        img.preview = URL.createObjectURL(img)
        setPreviewImg(img)
    }
    
    return (
        <div className="col-10">
            <div className='title'>Thêm nhân viên</div>
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
                                onChange={handleImg}
                            />
                        </div>
                        <div className="col-sm-3">
                            {previewImg && (
                                <img src={previewImg.preview} style={{width: '100%', height: '100%'}}/>
                            )}
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link 
                            to='/Employee' 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={createEmployee}
                        >
                            Lưu
                        </Link>
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

export default EmployeeAdd;