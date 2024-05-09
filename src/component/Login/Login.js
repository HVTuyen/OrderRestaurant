import React, { useState } from 'react';
import { useAuth } from '../Context/AuthProvider'
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom'
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon
}
    from 'mdb-react-ui-kit';

import './Login.scss'
import {LOGIN_API} from '../../layout/constants'
import { decodeJWT } from '../../Functions/decodeJWT';

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    console.log(email, password)
  
    const handleLogin = () => {
        const account = {
            email: email,
            password: password,
        };
        
        axios.post(LOGIN_API,account)
            .then(res => {
                const { accessToken, refreshToken } = res.data.data;
                
                // Lưu accessToken và refreshToken vào local storage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                
                // Tiến hành đăng nhập và chuyển hướng đến trang Ql
                login(decodeJWT(accessToken), accessToken, refreshToken);
                navigate(`/Ql`);
            })
            .catch(error => {
                alert('Tài khoản không đúng')
            });
    };
  
    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden' style={{ height: "100vh" }}>

            <MDBRow>

                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Nhà hàng TTP <br />
                        <span style={{ color: 'hsl(218, 81%, 75%)' }}>Thưởng thức hương vị cuộc sống.</span>
                    </h1>

                    <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
                        Khám phá một thế giới ẩm thực tuyệt vời tại nhà hàng của chúng tôi! Với sự kết hợp tinh tế của hương vị độc đáo và không gian ấm áp, chúng tôi cam kết mang lại cho bạn những trải nghiệm ẩm thực đầy phong cách và đẳng cấp. Hãy đến và thưởng thức những món ngon tuyệt vời và tạo ra những kỷ niệm đáng nhớ cùng những người thân yêu của bạn!
                    </p>

                </MDBCol>

                <MDBCol md='6' className='position-relative'>

                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>

                            <MDBRow>
                                <div className="divider d-flex align-items-center my-4">
                                    <h2 className="text-center fw-bold mx-3 mb-0">Đăng nhập hệ thống</h2>
                                </div>
                            </MDBRow>

                            <MDBInput 
                                wrapperClass='mb-4' 
                                label='Email'
                                type='email'
                                onChange={e => setEmail(e.target.value)}
                            />
                            <MDBInput 
                                wrapperClass='mb-4' 
                                label='Password' 
                                type='password' 
                                onChange={e => setPassword(e.target.value)}
                            />

                            <div className='d-flex justify-content-center mb-4'>
                            </div>

                            <button 
                                className='btn btn-primary' 
                                style={{width: '100%'}}
                                onClick={handleLogin} 
                            >
                                Đăng nhập
                            </button>

                            <div className="text-center">

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                </MDBBtn>

                            </div>

                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}

export default Login;
