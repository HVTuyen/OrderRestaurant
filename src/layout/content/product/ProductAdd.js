import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { PRODUCT_TYPE, PRODUCT_TITLE } from '../../constants'
import { storage } from '../../../firebaseConfig';

import Create from '../../../component/crud/Create';
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'
import { getCategories } from '../../../CallApi/CategoryApi/getCategories'

// function ProductAdd( ) {

//     const navigate = useNavigate();

//     const [nameFood,setNameFood] = useState('')
//     const [unitPrice,setUnitPrice] = useState('')
//     const [urlImage,setUrlImage] = useState('')
//     const [previewImg,setPreviewImg] = useState('')
//     const [categoryId,setCategoryId] = useState('')

//     const [categories,setCategories] = useState([])


//     //Xử lý ảnh
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
// 		const storageRef = ref(storage, `images/${image.name}`);
//         const uploadTask = uploadBytesResumable(storageRef, image, metadata);
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
//             (error) => {
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref)
//                     .then((downloadURL) => {
//                         setUrlImage(downloadURL);
//                         setImage(null);
//                         console.log('File available at', downloadURL);
//                     });
//             }
//         );
//     }

//     useEffect(() => {
//         if (urlImage) {
//             createProduct();
//         }
//     },[urlImage]);

//     console.log(nameFood,unitPrice, categoryId, urlImage)

//     useEffect(() => {
//         axios.get(CATEGORY_API)
//             .then(res => {
//                 setCategories(res.data)
//             })
//             .catch(error => {
//                 console.error('Error fetching categories:', error);
//             });
//     }, [])

//     const createProduct = async () => {
//         const newProduct = {
//             nameFood: nameFood,
//             unitPrice: unitPrice,
//             categoryId: categoryId,
//             image: urlImage,

//         };

//         axios.post(`${PRODUCT_API}post-with-image`,newProduct)
//         .then(() => {
//             navigate('/Ql/Product');
//         })
//         .catch(error => {
//             console.error('Error creating product:', error);
//         });
//     };

//     return (
//         <div className="col-10">
//             <div className='title'>Thêm món ăn</div>
//             <div className='row'>
//                 <div className='col-2'></div>
//                 <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Tên món ăn</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control"
//                                 value={nameFood}
//                                 onChange={e => setNameFood(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Đơn giá</label>
//                         <div className="col-sm-9">
//                             <input 
//                                 type="text" 
//                                 className="form-control"
//                                 value={unitPrice}
//                                 onChange={e => setUnitPrice(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Loại món ăn</label>
//                         <div className="col-sm-9">
//                             <select
//                                 className="form-select"
//                                 value={categoryId}
//                                 onChange={e => setCategoryId(e.target.value)}
//                             >
//                                 <option value="">Chọn loại món ăn</option>
//                                 {categories.map(category => (
//                                     <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
//                                 ))}
//                             </select>
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
//                             {previewImg && (
//                                 <img src={previewImg.preview} style={{width: '100%', height: '100%'}}/>
//                             )}
//                         </div>
//                     </div>

//                     <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
//                         <button 
//                             className='btn btn-outline-primary' 
//                             style={{marginRight:'6px'}}
//                             onClick={handleUpload}
//                         >
//                             Lưu
//                         </button>
//                         <Link to='/Ql/Product' className='btn btn-outline-danger'>
//                             Trở về
//                         </Link>
//                     </div>
//                 </div>
//                 <div className='col-2'></div>
//             </div>
//         </div>
//     )
// }

function ProductAdd() {

    const { account, token, refreshToken, reNewToken } = useAuth();

    const navigate = useNavigate();

    const searchFood = sessionStorage.getItem('searchFood');
    const categoryId = sessionStorage.getItem('categoryId');

    const [categories, setCategories] = useState([])

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
            const response = await getCategories(config);
            if (response && response.data) {
                setCategories(response.data);
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
                    const newDataResponse = await getCategories(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        setCategories(newDataResponse.data);
                    } else {
                        console.error('Error fetching categories after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching categories:');
            }
        };
        fetchData();
    }, []);

    console.log(categories)

    return (
        <div className="col-10">
            {
                categories.length > 0 ? (
                    <Create
                        type={PRODUCT_TYPE}
                        url={`/Ql/Product?page=1&search=${searchFood}&id=${categoryId}`}
                        title={PRODUCT_TITLE}
                        item={
                            [
                                {
                                    title: 'Tên món ăn',
                                    name: 'name',
                                    type: 'Text',
                                },
                                {
                                    title: 'Đơn giá',
                                    name: 'price',
                                    type: 'Text',
                                },
                                {
                                    title: 'Loại món',
                                    name: 'categoryId',
                                    type: 'Select',
                                    options: [...categories]
                                },
                                {
                                    title: 'Ảnh',
                                    name: 'image',
                                    type: 'Image',
                                }
                            ]
                        }
                    />
                ) : null
            }
        </div>
    )
}

export default ProductAdd;