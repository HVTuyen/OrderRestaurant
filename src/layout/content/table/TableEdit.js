import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { TABLE_TITLE, TABLE_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Update from '../../../component/crud/Update';
import { getTable } from '../../../CallApi/TableApi/getTable'

// function TableEdit( ) {

//     const navigate = useNavigate();

//     const {id} = useParams()
//     console.log(id)

//     const [tableName,setTableName] = useState('')
//     const [urlImage,setUrlImage] = useState('')
//     const [previewImg,setPreviewImg] = useState('')
//     const [statusId,setStatusId] = useState('')
//     const [note,setNote] = useState('')

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
//             updateTable()
//         }
//     }
//     useEffect(() => {
//         if (urlImage) {
//             updateTable();
//         }
//     },[isUpload]);

//     useEffect(() => {
//         axios.get(`${TABLE_API}${id}`)
//             .then(res => {
//                 setTableName(res.data.tableName)
//                 setUrlImage(res.data.qR_id)
//                 setStatusId(res.data.statusId)
//                 setNote(res.data.note)
//             })
//             .catch(error => {
//                 console.error('Error fetching table:', error);
//             });
//     }, [])

//     const updateTable = async () => {
//         const newTable = {
//             tableName: tableName,
//             statusId: statusId,
//             note: note,
//             qR_id: urlImage,
//         };

//         axios.put(`${TABLE_API}${id}`,newTable)
//         .then(() => {
//             navigate('/Ql/Table');
//         })
//         .catch(error => {
//             console.error('Error creating Table:', error);
//         });
//     }

//     return (
//         <div className="col-10">
//             <div className='title'>Chỉnh sửa bàn ăn</div>
//             <div className='row'>
//                 <div className='col-2'></div>
//                 <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Tên bàn</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 value={tableName}
//                                 onChange={e => setTableName(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Ảnh QR</label>
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
//                             className='btn btn-outline-primary' 
//                             style={{marginRight:'6px'}}
//                             onClick={handleUpdate}
//                         >
//                             Lưu
//                         </button>
//                         <Link to='/Ql/Table' className='btn btn-outline-danger'>
//                             Trở về
//                         </Link>
//                     </div>
//                 </div>
//                 <div className='col-2'></div>
//             </div>
//         </div>
//     )
// }

function TableEdit() {
    const { account, token, refreshToken, reNewToken } = useAuth();

    const { id } = useParams()
    console.log(id)

    const navigate = useNavigate();

    const [table, setTable] = useState({})

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
            const response = await getTable(config, id);
            if (response && response.data) {
                setTable(response.data);
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
                    const newDataResponse = await getTable(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setTable(newDataResponse.data);
                    } else {
                        console.error('Error fetching table after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching table');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="col-10">
            <Update
                id={id}
                type={TABLE_TYPE}
                url='/Ql/Table'
                title={TABLE_TITLE}
                item={
                    [
                        {
                            title: 'Tên bàn',
                            name: 'name',
                            value: table.name,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh QR',
                            name: 'image',
                            value: table.urlImage,
                            type: 'Image',
                        }
                    ]
                }
            />
        </div>
    )
}

export default TableEdit;