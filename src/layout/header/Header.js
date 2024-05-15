import clsx from 'clsx'
import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars} from '@fortawesome/free-solid-svg-icons'
import { faBell} from '@fortawesome/free-regular-svg-icons'
import {Link, useParams, useNavigate} from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';

import { useAuth } from '../../component/Context/AuthProvider';
import {decodeJWT} from '../../Functions/decodeJWT'
import Notification from '../../component/Notify/Notification';

function Header() {

    const navigate = useNavigate();
    
    const { account, logout } = useAuth();
    const [isShow, setIsShow] = useState(false)
    const [top, setTop]= useState(0)
    const [widths, setWidths] = useState({});

    const infoButtonRef = useRef(null);
    const logoutButtonRef = useRef(null);

    console.log(account)

    const classHeader = clsx(styles.header,'navbar navbar-expand-sm navbar-dark')
    const classNotification = clsx(styles.notification, 'notification')
    const classNotificationIcon = clsx(styles.notificationIcon)
    const classNotificationTotal = clsx(styles.notificationTotal, 'notification')

    const handleLogout = () => {
        logout()
        navigate('/Login');
    }

    const unShowNotification = (e) => {
        const isButtonClick = e.target.closest('.notification');
        
        if (!isButtonClick) {
            setIsShow(false);
        }
    }

    const handleUnShowNotification = (e) => {
        unShowNotification(e)
    }

    document.addEventListener('click', handleUnShowNotification);

    const handleScroll = () => {
        setTop(document.documentElement.scrollTop)
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener when component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        // Lấy ra chiều rộng của các phần tử và cập nhật state
        if (infoButtonRef.current && logoutButtonRef.current) {
            const infoWidth = infoButtonRef.current.offsetWidth;
            const logoutWidth = logoutButtonRef.current.offsetWidth;
            setWidths({ infoWidth, logoutWidth });
        }
    }, []);

    return (
        <nav className={classHeader}>
            <div className="container-fluid logo">
                <div className='d-flex a-center'>
                    <img src='https://firebasestorage.googleapis.com/v0/b/orderrestaurant-3dcf5.appspot.com/o/images%2FLogo_tach.png?alt=media&token=66bb1e6b-a21f-4d57-a5ce-3bc996df63e1' style={{height:'40px'}}/>
                    <div style={{fontSize:'24px', fontWeight:'700', color:'#fff', margin:'0 0 0 12px'}}>Order Restaurant</div>
                </div>
                <div className="collapse navbar-collapse j-flex-end">
                    <div className="d-flex a-center">
                        <div 
                            className={classNotification}
                            style={{position:'relative'}}
                            onClick={() => setIsShow(true)}
                        >
                            <FontAwesomeIcon icon={faBell} className={classNotificationIcon} style={isShow ? {color:'#fff'} : null}/>
                            <span className={classNotificationTotal} style={isShow ? {color:'#fff'} : null}>
                                1
                            </span>

                            {
                                isShow ? (
                                    <Notification 
                                        top={top}
                                        widths={widths}
                                    />
                                ) : ''
                            }
                        </div>

                        <div className='btn btn-outline-info d-flex' style={{marginLeft:'24px'}} ref={infoButtonRef}>
                            <img />
                            <div>{account?.unique_name}</div>
                        </div>
                        <button 
                            className="btn btn-outline-warning" 
                            type="button" 
                            style={{marginLeft:'4px'}}
                            ref={logoutButtonRef}
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