import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { createCategory } from '../../CallApi/CategoryApi/createCategory';
import { createProduct } from '../../CallApi/ProductApi/createProduct';
import { createTable } from '../../CallApi/TableApi/createTable';
import { createEmployee } from '../../CallApi/EmployeeApi/createEmployee'
import { renewToken } from '../../CallApi/renewToken'
import { useAuth } from '../Context/AuthProvider';
import { storage } from '../../firebaseConfig';

import TextInput from "../input/TextInput"
import SelectInput from "../input/SelectInput"
import ImageInput from "../input/ImageInput"

const Create = (props) => {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [formData, setFormData] = useState({});
    const [urlImage, setUrlImage] = useState('')
    const [errors, setErrors] = useState([])

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
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            handleCreateWithImage(config, oldtoken)
        }
    }, [urlImage]);

    const handleCreateWithImage = async (config, oldtoken) => {
        let data
        if (props.type === 'Food') {

            data = {
                nameFood: formData.name,
                unitPrice: formData.price,
                categoryId: formData.categoryId,
                image: urlImage,
            }

            const response = await createProduct(config, data);
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
                        const newDataResponse = await createProduct(newconfig, data);
                        if (newDataResponse && newDataResponse.data) {
                            navigate(props.url)
                        } else {
                            console.error(`Error create ${props.type} after token renewal`);
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                } else {
                    console.error(`Error create ${props.type}`);
                }
            }
        }
        if (props.type === 'Ban') {
            data = {
                tableName: formData.name,
                qR_id: urlImage,
            }
            console.log(data)
            const response = await createTable(config, data);
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
                        const newDataResponse = await createTable(newconfig, data);
                        if (newDataResponse && newDataResponse.data) {
                            navigate(props.url)
                        } else {
                            console.error(`Error create ${props.type} after token renewal`);
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                } else {
                    console.error(`Error create ${props.type}`);
                }
            }
        }
        if (props.type === 'Employee') {
            data = {
                employeeName: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                image: urlImage,
            }
            console.log(data)
            const response = await createEmployee(config, data);
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
                        const newDataResponse = await createEmployee(newconfig, data);
                        if (newDataResponse && newDataResponse.data) {
                            navigate(props.url)
                        } else {
                            console.error(`Error create ${props.type} after token renewal`);
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                } else {
                    console.error(`Error create ${props.type}`);
                }
            }
        }
    }

    const handleCreateType = async (config) => {
        if (props.type === 'Category') {
            if (formData.name && formData.description) {
                const data = {
                    categoryName: formData.name,
                    description: formData.description,
                }
                return createCategory(config, data)
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.description) {
                    setErrors(prevErrors => [...prevErrors, 'description'])
                }
            }
        }
        if (props.type === 'Food') {
            if (formData.name && formData.price && formData.categoryId && formData.image) {
                handleUpload()
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.description) {
                    setErrors(prevErrors => [...prevErrors, 'price'])
                }
                if (!formData.categoryId) {
                    setErrors(prevErrors => [...prevErrors, 'categoryId'])
                }
                if (!formData.image) {
                    setErrors(prevErrors => [...prevErrors, 'image'])
                }
            }
        }
        if (props.type === 'Ban') {
            if (formData.name && formData.image) {
                handleUpload()
            } else {
                if (!formData.name) {
                    setErrors(prevErrors => [...prevErrors, 'name'])
                }
                if (!formData.image) {
                    setErrors(prevErrors => [...prevErrors, 'image'])
                }
            }
        }
        if (props.type === 'Employee') {
            if (formData.name && formData.phone && formData.email && formData.password && formData.image) {
                handleUpload()
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

    console.log(errors)

    const handleCreate = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const oldtoken = {
            accessToken: token,
            refreshToken: refreshToken
        };
        const response = await handleCreateType(config);
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
                    const newDataResponse = await handleCreateType(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        navigate('/Ql/Category/')
                    } else {
                        console.error(`Error create ${props.type} after token renewal`);
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error(`Error create ${props.type}`);
            }
        }
    };

    console.log(formData)

    return (
        <>
            <div className='title'>Thêm {props.title}</div>
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
                                </>
                            )}
                            {item.type === 'Select' && (
                                <>
                                    <SelectInput
                                        title={item.title}
                                        name={item.name}
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
                            onClick={handleCreate}
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

export default Create;