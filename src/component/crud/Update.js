import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_TYPE, PRODUCT_TYPE, TABLE_TYPE, EMPLOYEE_TYPE } from "../../layout/constants";
import { editCategory } from '../../CallApi/CategoryApi/editCategory';
import { editProduct } from '../../CallApi/ProductApi/editProduct'
import { editTable } from '../../CallApi/TableApi/editTable'
import { editEmployee } from '../../CallApi/EmployeeApi/editEmployee'
import { renewToken } from '../../CallApi/renewToken'
import { useAuth } from '../Context/AuthProvider';
import { storage } from '../../firebaseConfig';

import TextInput from "../input/TextInput"
import SelectInput from "../input/SelectInput"
import ImageInput from "../input/ImageInput"

const Update = (props) => {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [formData, setFormData] = useState({});
    const [urlImage, setUrlImage] = useState('')
    const [errors, setErrors] = useState([])
    const [errorsFormat, setErrorsFormat] = useState([])

    const handleDataFromInput = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const metadata = {
        contentType: 'image/jpeg',
    };

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${formData.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formData.image, metadata);
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
            (error) => {
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setUrlImage(downloadURL);
                        // setImage(null);
                        console.log('File available at', downloadURL);
                    });
            }
        );
    }

    useEffect(() => {
        if (urlImage) {
            handleUpdate()
        }
    }, [urlImage]);

    const handleUpdateType = async (config) => {
        if (props.type === CATEGORY_TYPE) {
            if (formData.name && formData.description) {
                const data = {
                    name: formData.name,
                    description: formData.description,
                }
                return editCategory(config, props.id, data)
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.description) {
                    setErrors(prevErrors => [...prevErrors, 'description'])
                }
            }
        }
        if (props.type === PRODUCT_TYPE) {
            if (formData.name && formData.price && formData.categoryId && formData.image) {
                if (!parseInt(formData.price)) {
                    setErrorsFormat(prevErrors => [...prevErrors, 'price'])
                } else {
                    if (typeof formData.image === 'object') {
                        if(!urlImage) {
                            handleUpload()
                        } else {
                            const data = {
                                name: formData.name,
                                unitPrice: formData.price,
                                categoryId: formData.categoryId,
                                urlImage: urlImage,
                            }
                            return editProduct(config, props.id, data)
                        }
                    }
                    else {
                        const data = {
                            name: formData.name,
                            unitPrice: formData.price,
                            categoryId: formData.categoryId,
                            urlImage: formData.image,
                        }
                        return editProduct(config, props.id, data)
                    }
                }
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.price) {
                    setErrors(prevErrors => [...prevErrors, 'price'])
                }
                if (formData.price) {
                    if (!parseInt(formData.price)) {
                        setErrorsFormat(prevErrors => [...prevErrors, 'price'])
                    }
                }
                if (!formData.categoryId) {
                    setErrors(prevErrors => [...prevErrors, 'categoryId'])
                }
                if (!formData.image) {
                    setErrors(prevErrors => [...prevErrors, 'image'])
                }
            }
        }
        if (props.type === TABLE_TYPE) {
            if (formData.name && formData.image) {
                if (typeof formData.image === 'object') {
                    if(!urlImage) {
                        handleUpload()
                    } else {
                        const data = {
                            name: formData.name,
                            urlImage: urlImage,
                        }
                        return editTable(config, props.id, data)
                    }
                }
                else {
                    const data = {
                        name: formData.name,
                        urlImage: formData.image,
                    }
                    return editTable(config, props.id, data)
                }
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.image) {
                    setErrors(prevErrors => [...prevErrors, 'image'])
                }
            }
        }
        if (props.type === EMPLOYEE_TYPE) {
            if (formData.name && formData.email && formData.password && formData.image) {
                if (typeof formData.image === 'object') {
                    if(!urlImage) {
                        handleUpload()
                    } else {
                        const data = {
                            name: formData.name,
                            email: formData.email,
                            password:  formData.password,
                            urlImage: urlImage,
                        }
                        return editEmployee(config, props.id, data)
                    }
                }
                else {
                    const data = {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        urlImage: formData.image,
                    }
                    return editEmployee(config, props.id, data)
                }
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.phone) {
                    setErrors(prevErrors => [...prevErrors, 'phone'])
                }
                if (!formData.email) {
                    setErrors(prevErrors => [...prevErrors, 'email'])
                }
                if (!formData.password) {
                    setErrors(prevErrors => [...prevErrors, 'password'])
                }
                if (!formData.image) {
                    setErrors(prevErrors => [...prevErrors, 'image'])
                }
            }
        }
    }

    const handleUpdate = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await handleUpdateType(config);
        if (response && response.data) {
            navigate(props.url)
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
                    const newDataResponse = await handleUpdateType(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        navigate(props.url)
                    }
                    else {
                        if (newDataResponse && newDataResponse.error === 'AccessDenied') {
                            navigate('/Ql/AccessDenied')
                        }
                        else {
                            console.error(`Error edit ${props.type} after token renewal`);
                        }
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error(`Error edit ${props.type}`);
            }
        }
    };

    return (
        <>
            <div className='title'>Sửa {props.title}</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{ borderRadius: '3px', border: '1px solid #333' }}>

                    {props.item.map((item, index) => (
                        <div key={index} className="mb-3 row" style={{ margin: '24px' }}>
                            {item.type === 'Text' && (
                                <>
                                    <TextInput
                                        title={item.title}
                                        name={item.name}
                                        value={item.value}
                                        type={item.type}
                                        sendData={handleDataFromInput}
                                    />
                                    {
                                        errors.includes(item.name) && !formData[item.name] && (
                                            <>
                                                <div className="col-sm-3"></div>
                                                <label className="col-sm-9 error">Không được để trống trường [{item.title}]!</label>
                                            </>
                                        )
                                    }
                                    {
                                        errorsFormat.includes(item.name) && formData[item.name] && (
                                            <>
                                                <div className="col-sm-3"></div>
                                                <label className="col-sm-9 error">Sai định dạng trường [{item.title}]!</label>
                                            </>
                                        )
                                    }
                                </>
                            )}
                            {item.type === 'Select' && (
                                <>
                                    <SelectInput
                                        title={item.title}
                                        name={item.name}
                                        value={item.value}
                                        type={item.type}
                                        options={item.options}
                                        sendData={handleDataFromInput}
                                    />
                                    {
                                        errors.includes(item.name) && !formData[item.name] && (
                                            <>
                                                <div className="col-sm-3"></div>
                                                <label className="col-sm-9 error">Bắt buộc chọn [{item.title}]!</label>
                                            </>
                                        )
                                    }
                                </>
                            )}
                            {item.type === 'Image' && (
                                <>
                                    <ImageInput
                                        title={item.title}
                                        name={item.name}
                                        value={item.value}
                                        type={item.type}
                                        sendData={handleDataFromInput}
                                    />
                                    {
                                        errors.includes(item.name) && !formData[item.name] && (
                                            <>
                                                <div className="col-sm-3"></div>
                                                <label className="col-sm-9 error">Bắt buộc chọn [{item.title}]!</label>
                                            </>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    ))}


                    <div className='d-flex j-flex-end' style={{ margin: '24px 38px 24px 24px' }}>
                        <button
                            className='btn btn-outline-primary'
                            style={{ marginRight: '6px' }}
                            onClick={handleUpdate}
                        >
                            Lưu
                        </button>
                        <Link to={props.url} className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </>
    )
}

export default Update;