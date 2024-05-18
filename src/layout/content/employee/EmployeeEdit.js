import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { EMPLOYEE_TITLE, EMPLOYEE_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Update from '../../../component/crud/Update';
import { getEmployee } from '../../../CallApi/EmployeeApi/getEmployee'

// function EmployeeEdit( ) {

//     const navigate = useNavigate();

//     const {id} = useParams()
//     console.log(id)

//     const [employeeName,setEmployeeName] = useState('')
//     const [phone,setPhone] = useState('')
//     const [email,setEmail] = useState('')
//     const [password,setPassword] = useState('')
//     const [urlImage,setUrlImage] = useState('')
//     const [previewImg,setPreviewImg] = useState('')

//     //Xử lí ảnh
//     const [isUpload,setIsUpload] = useState(false)
//     const [image, setImage] = useState(null);
//     useEffect(() => {
//         return () => {
//             previewImg && URL.revokeObjectURL(previewImg.preview)
//         }
//     }, [previewImg])
//     const handleChange = (e) => {
//         const img = e.target.files[0]
//         if (img) {
//             setImage(img);
//             img.preview = URL.createObjectURL(img)
//             setPreviewImg(img)
//         }
//     };
//     const metadata = {
//         contentType: 'image/jpeg',
//     };
//     const handleUpload = () => {
// 		const storageRef = ref(storage, `images/${image.name}`); // tạo 1 địa chỉ để chứa ảnh chuẩn bị tải lên store
//         const uploadTask = uploadBytesResumable(storageRef, image, metadata); // hàm tải ảnh lên store 
//         uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//                 switch (snapshot.state) {
//                     case 'paused':
//                         console.log('Upload is paused');
//                         break;
//                     case 'running':
//                         console.log('Upload is running');
//                         break;
//                 }
//             },
//             (err) => {
                
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref)
//                     .then((downloadURL) => {
//                         setUrlImage(downloadURL);
//                         setIsUpload(true)
//                         setImage(null);
//                         console.log('File available at', downloadURL);
//                     });
//             }
//         );
//     }
//     const handleUpdate = () => {
//         if(image!=null) {
//             handleUpload()
//         }
//         else {
//             updateEmployee()
//         }
//     }
//     useEffect(() => {
//         if (urlImage) {
//             updateEmployee();
//         }
//     },[isUpload]);

//     useEffect(() => {
//         axios.get(`${EMPLOYEE_API}${id}`)
//             .then(res => {
//                 setEmployeeName(res.data.employeeName)
//                 setPhone(res.data.phone)
//                 setEmail(res.data.email)
//                 setPassword(res.data.password)
//                 setUrlImage(res.data.image)
//             })
//             .catch(error => {
//                 console.error('Error fetching table:', error);
//             });
//     }, [])

//     const updateEmployee = async () => {
//         const newEmployee = {
//             employeeName: employeeName,
//             phone: phone,
//             email: email,
//             password: password,
//             image: urlImage,
//         };
        
//         axios.put(`${EMPLOYEE_API}${id}`,newEmployee)
//         .then(() => {
//             navigate('/Ql/Employee');
//         })
//         .catch(error => {
//             console.error('Error creating Employee:', error);
//         });
//     }
    
//     return (
//         <div className="col-10">
//             <div className='title'>Chỉnh sửa thông tin nhân viên</div>
//             <div className='row'>
//                 <div className='col-2'></div>
//                 <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Tên nhân viên</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 value={employeeName}
//                                 onChange={e => setEmployeeName(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Số điện thoại</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 value={phone}
//                                 onChange={e => setPhone(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Email</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 value={email}
//                                 onChange={e => setEmail(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Mật khẩu</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 value={password}
//                                 onChange={e => setPassword(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Ảnh</label>
//                         <div className="col-sm-6">
//                             <input 
//                                 type="file" 
//                                 className="form-control"    
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div className="col-sm-3">
//                             <img src={previewImg?previewImg.preview:urlImage} style={{width: '100%', height: '100%'}}/>
//                         </div>
//                     </div>
//                     <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
//                         <button 
//                             to='/Ql/Employee' 
//                             className='btn btn-outline-primary' 
//                             style={{marginRight:'6px'}}
//                             onClick={handleUpdate}
//                         >
//                             Lưu
//                         </button>
//                         <Link to='/Ql/Employee' className='btn btn-outline-danger'>
//                             Trở về
//                         </Link>
//                     </div>
//                 </div>
//                 <div className='col-2'></div>
//             </div>
//         </div>
//     )
// }

function EmployeeEdit() {
    const { account, token, refreshToken, reNewToken } = useAuth();

    const { id } = useParams()
    console.log(id)

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({})

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
            const response = await getEmployee(config, id);
            if (response && response.data) {
                setEmployee(response.data);
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
                    const newDataResponse = await getEmployee(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setEmployee(newDataResponse.data);
                    } else {
                        console.error('Error fetching rmployee after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching rmployee');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="col-10">
            <Update
                id={id}
                type={EMPLOYEE_TYPE}
                url='/Ql/Employee'
                title={EMPLOYEE_TITLE}
                item={
                    [
                        {
                            title: 'Tên nhân viên',
                            name: 'name',
                            value: employee.employeeName,
                            type: 'Text',
                        },
                        {
                            title: 'Số điện thoại',
                            name: 'phone',
                            value: employee.phone,
                            type: 'Text',
                        },
                        {
                            title: 'Email',
                            value: employee.email,
                            name: 'email',
                            type: 'Text',
                        },
                        {
                            title: 'Mật khẩu',
                            name: 'password',
                            value: employee.password,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh',
                            name: 'image',
                            value: employee.image,
                            type: 'Image',
                        }
                    ]
                }
            />
        </div>
    )
}


export default EmployeeEdit;