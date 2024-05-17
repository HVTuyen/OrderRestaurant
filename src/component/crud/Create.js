import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

import { createCategory } from '../../CallApi/CategoryApi/createCategory';
import { renewToken } from '../../CallApi/renewToken'
import { useAuth } from '../Context/AuthProvider';

import TextInput from "../input/TextInput"
import SelectInput from "../input/SelectInput"
import ImageInput from "../input/ImageInput"

const Create =(props) => {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [formData, setFormData] = useState({});

    const handleDataFromInput = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value 
        }));
    };

    const handleCreateType = async (config) => {
        if(props.type === 'Category') {
            const data = {
                categoryName: formData.name,
                description: formData.description,
            }
            return createCategory(config, data)
        }
    }

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

    console.log(props)

    return (
        <>
            <div className='title'>Thêm {props.title}</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    
                    {props.item.map((item, index) => (
                        <div key={index} className="mb-3 row" style={{ margin: '24px' }}>
                            {item.type === 'Text' && (
                                <TextInput 
                                    title={item.title}
                                    name={item.name}
                                    type={item.type} 
                                    sendData={handleDataFromInput} 
                                />
                            )}
                            {item.type === 'Select' && (
                                <SelectInput
                                    title={item.title}
                                    name={item.name}
                                    type={item.type}
                                    options={item.options}
                                    sendData={handleDataFromInput} 
                                />
                            )}
                            {/* {item.type === 'Image' && (
                                <ImageInput 
                                    title={item.title}
                                    name={item.name}
                                    type={item.type} 
                                    sendData={handleDataFromInput} 
                                />
                            )} */}
                        </div>
                    ))}


                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
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