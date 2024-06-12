import clsx from 'clsx'
import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, collection, addDoc, deleteDoc } from "firebase/firestore";

import { useAuth } from '../../component/Context/AuthProvider';
import { renewToken } from '../../CallApi/renewToken';
import { decodeJWT } from '../../Functions/decodeJWT'
import Notification from '../../component/Notify/Notification';
import { NOTIFICATION_API, GET_NOTIFICATION_COUNT_SUB } from '../constants';
import { getNotificationCount } from '../../CallApi/NotificationApi/GetNotificationCount';
import { db } from '../../firebaseConfig';
import { Howl, Howler } from 'howler';
import soundnotification from './sound-notification.mp3'

function Header() {

    const navigate = useNavigate();

    const sound = new Howl({
        src: soundnotification,
    });

    const { account, token, refreshToken, reNewToken, logout } = useAuth();
    const [isShow, setIsShow] = useState(false)
    const [countNotification, setCountNotification] = useState(0)
    const [top, setTop] = useState(0)
    const [widths, setWidths] = useState({});
    const [render, setRender] = useState(0)

    const infoButtonRef = useRef(null);
    const logoutButtonRef = useRef(null);

    const classHeader = clsx(styles.header, 'navbar navbar-expand-sm navbar-dark')
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

    const handleClickNotification = (isCheck) => {
        
        setIsShow(false)
        if (!isCheck) {
            setRender(prevCount => prevCount + 1)
            setCountNotification(prevCount => prevCount - 1)
        }

        if (isCheck == null) {
            setRender(prevCount => prevCount + 1)
            setCountNotification(0)
        }
    }

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
            const response = await getNotificationCount(config);
            if (response && response.data) {
                setCountNotification(response.data);
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
                    const newDataResponse = await getNotificationCount(newconfig);
                    if (newDataResponse && newDataResponse.data) {
                        setCountNotification(newDataResponse.data);
                    } else {
                        console.error('Error fetching notifications after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            }
        };
        fetchData();
    }, [render]);

    const ordersRef = collection(db, "orders");

    //Thông báo Order
    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("orders: ", change.doc.data());
                    sound.play()
                    deleteDoc(doc(db, "orders", change.doc.id))
                    .then(() => {
                        console.log("Document successfully deleted!");
                    })
                    .catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
            });
            setRender(prevCount => prevCount + 1);
        }, (error) => {
            console.error("Error getting orders:", error);
        });

        return () => unsub(); // Dọn dẹp listener khi component unmount
    }, []);

    return (
        <nav className={classHeader}>
            <div className="container-fluid logo">
                <Link to='/Ql' className='d-flex a-center' style={{textDecoration:'none'}}>
                    <img src='https://firebasestorage.googleapis.com/v0/b/orderrestaurant-3dcf5.appspot.com/o/images%2FLogo_tach.png?alt=media&token=66bb1e6b-a21f-4d57-a5ce-3bc996df63e1' style={{ height: '40px' }} />
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 0 12px' }}>Order Restaurant</div>
                </Link>
                <div className="collapse navbar-collapse j-flex-end">
                    <div className="d-flex a-center">
                        <div
                            className={classNotification}
                            style={{ position: 'relative' }}
                            onClick={() => setIsShow(true)}
                        >
                            <FontAwesomeIcon icon={faBell} className={classNotificationIcon} style={isShow ? { color: '#fff' } : null} />
                            {
                                countNotification !== 0 ? (
                                    <span className={classNotificationTotal} style={isShow ? { color: '#fff' } : null}>
                                        {countNotification}
                                    </span>
                                ) : null
                            }

                            {
                                isShow ? (
                                    <Notification
                                        top={top}
                                        widths={widths}
                                        handleClick={handleClickNotification}
                                    />
                                ) : ''
                            }
                        </div>

                        <div className='btn btn-outline-info d-flex' style={{ marginLeft: '24px' }} ref={infoButtonRef}>
                            <img />
                            <div>{account?.name}</div>
                        </div>
                        <button
                            className="btn btn-outline-warning"
                            type="button"
                            style={{ marginLeft: '4px' }}
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