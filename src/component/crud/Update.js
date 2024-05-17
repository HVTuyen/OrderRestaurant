import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

import { editCategory } from '../../CallApi/CategoryApi/editCategory';
import { renewToken } from '../../CallApi/renewToken'
import { useAuth } from '../Context/AuthProvider';

import TextInput from "../input/TextInput"

const Update =(props) => {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const [formData, setFormData] = useState({});

    const handleDataFromInput = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    console.log(props.id)

    const handleUpdateType = async (config) => {
        if(props.type === 'Category') {
            const data = {
                categoryName: formData.name,
                description: formData.description,
            }
            return editCategory(config, props.id, data)
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
                    const newDataResponse = await handleUpdateType(config);
                    if (newDataResponse && newDataResponse.data) {
                        navigate(props.url)
                    } else {
                        console.error(`Error edit ${props.type} after token renewal`);
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
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    
                    {props.item.map((item, index) => (
                        <div key={index} className="mb-3 row" style={{ margin: '24px' }}>
                            {item.type === 'Text' && (
                                <TextInput 
                                    title={item.title}
                                    name={item.name}
                                    value={item.value}
                                    type={item.type} 
                                    sendData={handleDataFromInput} 
                                />
                            )}
                        </div>
                    ))}


                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
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