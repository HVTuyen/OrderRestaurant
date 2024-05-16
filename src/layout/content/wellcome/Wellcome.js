import './Wellcome.scss'
import React, { useEffect } from 'react';
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
}
    from 'mdb-react-ui-kit';

function Wellcome( props ) {

    useEffect(() => {
        sessionStorage.setItem('activeMenu', 'wellcome');
        props.activeMenu('wellcome')
    }, [])

    return (
        <div className='col-10 d-flex a-center'>
            <MDBContainer fluid className='my-5'>

                <MDBRow className='g-0 align-items-center'>
                    <MDBCol col='6'>

                        <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                            <MDBCardBody className='p-5 shadow-5 text-center'>
                                <h2 className="fw-bold mb-5">Chào mừng đến trang quản lý</h2>
                                <div>
                                    <p>Chúng tôi sẽ giúp quản lý các {props.title} của bạn</p>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    <MDBCol col='6'>
                        <img src="https://www.bravo.com.vn/wp-content/uploads/2022/11/Xuyen_D5.jpg" class="w-100 rounded-4 shadow-4"
                            alt="" fluid />
                    </MDBCol>


                </MDBRow>
                </MDBContainer>
        </div>
    );
}
export default Wellcome;