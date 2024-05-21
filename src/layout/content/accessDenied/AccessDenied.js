import './AccessDenied.scss'
import React, { useEffect } from 'react';
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
}
    from 'mdb-react-ui-kit';

function AccessDenied( props ) {

    useEffect(() => {
        sessionStorage.setItem('activeMenu', 'accessdenied');
        props.activeMenu('accessdenied');
    }, [])

    return (
        <div className='col-10 d-flex a-center'>
            <MDBContainer fluid className='my-5' >
                <MDBRow className='g-0 align-items-center'>
                    <MDBCol col='6'>
                        <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                            <MDBCardBody className='p-5 shadow-5 text-center'>
                                <h2 className="fw-bold mb-5" style={{ color: "red" }}>Quyền truy cập bị hạn chế</h2>
                                <div className="alert alert-danger" role="alert">
                                    Bạn không có quyền truy cập vào chức năng này!
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol col='6'>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2dTv0PA4eDHp7fDNx9OoAGrKrncTqbBn75tLE9Dc4Jw&s" className="w-100 rounded-4 shadow-4"
                            alt="" fluid />
                    </MDBCol>
                </MDBRow>
            </MDBContainer >
        </div>
    );
}
export default AccessDenied;