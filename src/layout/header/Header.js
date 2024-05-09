import clsx from 'clsx'
import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars} from '@fortawesome/free-solid-svg-icons'
import {Link, useParams, useNavigate} from 'react-router-dom'

import { useAuth } from '../../component/Context/AuthProvider';
import {decodeJWT} from '../../Functions/decodeJWT'
import { useEffect, useState } from 'react';

function Header() {

    const navigate = useNavigate();
    
    const { account, logout } = useAuth();

    console.log(account)

    const classHeader = clsx(styles.header,'navbar navbar-expand-sm navbar-dark')

    const handleLogout = () => {
        logout()
        navigate('/Login');
    }

    return (
        <nav className={classHeader}>
            <div className="container-fluid logo">
                <div className='d-flex a-center'>
                    <img src='https://firebasestorage.googleapis.com/v0/b/orderrestaurant-3dcf5.appspot.com/o/images%2FLogo_tach.png?alt=media&token=66bb1e6b-a21f-4d57-a5ce-3bc996df63e1' style={{height:'40px'}}/>
                    <div style={{fontSize:'24px', fontWeight:'700', color:'#fff', margin:'0 0 0 12px'}}>Order Restaurant</div>
                </div>
                <div className="collapse navbar-collapse j-flex-end">
                    <div className="d-flex">
                        <div className='btn btn-outline-info d-flex'>
                            <img />
                            <div>{account?.unique_name}</div>
                        </div>
                        <button 
                            className="btn btn-outline-warning" 
                            type="button" 
                            style={{marginLeft:'4px'}}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header