import React, { useState, useEffect } from 'react';
import clsx from 'clsx'
import style from './notify.module.scss';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'

import { getNotification } from '../../CallApi/NotificationApi/GetNotification';
import { seenNotification } from '../../CallApi/NotificationApi/SeenNotification';
import { seenNotificationAll } from '../../CallApi/NotificationApi/SeenNotificationAll';
import { useAuth } from '../Context/AuthProvider';
import { renewToken } from '../../CallApi/renewToken';

const Notification = (props) => {

  const [notifications, setNotifications] = useState([])

  const { account, token, refreshToken, reNewToken } = useAuth();

  const navigate = useNavigate();

  const searchOrder = sessionStorage.getItem('searchOrder');
  const searchRequest = sessionStorage.getItem('searchRequest');

  const notificationContainer = clsx(style.notificationContainer)
  const notification = clsx(style.notification)
  const notificationSeen = clsx(style.notificationSeen, 'd-flex j-center')
  const notificationItem = clsx(style.notificationItem, 'd-flex')
  const notificationItemCheck = clsx(style.notificationItemCheck, style.notificationItem, 'd-flex')
  const notificationTitle = clsx(style.notificationTitle, 'col-4')
  const notificationContent = clsx(style.notificationTitle, 'col-5')
  const notificationTime = clsx(style.notificationTime, 'col-3')
  const widthNotification = 500

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
      const response = await getNotification(config);
      if (response && response.data) {
        setNotifications(response.data);
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
          const newDataResponse = await getNotification(newconfig);
          if (newDataResponse && newDataResponse.data) {
            setNotifications(newDataResponse.data);
          } else {
            console.error('Error fetching notifications after token renewal');
          }
        } catch (error) {
          console.error('Error renewing token:', error);
        }
      } else {
        console.error('Error fetching notifications');
      }
    };
    fetchData();
  }, []);

  const handleClickToHeader = (isCheck) => {
    props.handleClick(isCheck)
  }

  const handleNotificationClick = async (id, type, isCheck) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const oldtoken = {
      accessToken: token,
      refreshToken: refreshToken
    };
    const response = await seenNotification(config, id);
    if (response && response.data) {
      handleClickToHeader(isCheck)
      if (type === 'Order') {
        navigate(`/Ql/Action/Order?page=1&search=${searchOrder || ''}`)
      }
      if (type === 'Requirements') {
        navigate(`/Ql/Action/Request?page=1&search=${searchRequest || ''}`)
      }
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
        const newDataResponse = await seenNotification(newconfig);
        if (newDataResponse && newDataResponse.data) {
          handleClickToHeader()
          if (type === 'Order') {
            sessionStorage.setItem('searchOrder', '')
            navigate(`/Ql/Action/Order?page=1&search=${searchOrder || ''}`)
          }
          if (type === 'Requirements') {
            sessionStorage.setItem('searchRequest', '')
        navigate(`/Ql/Action/Request?page=1&search=${searchRequest || ''}`)
          }
        } else {
          console.error('Error seen notifications after token renewal');
        }
      } catch (error) {
        console.error('Error renewing token:', error);
      }
    } else {
      console.error('Error seen notifications');
    }
  }

  const handleNotificationClickAll = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const oldtoken = {
      accessToken: token,
      refreshToken: refreshToken
    };
    const response = await seenNotificationAll(config);
    if (response && response.data) {
      handleClickToHeader()
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
        const newDataResponse = await seenNotification(newconfig);
        if (newDataResponse && newDataResponse.data) {
          handleClickToHeader()
        } else {
          console.error('Error seen notifications after token renewal');
        }
      } catch (error) {
        console.error('Error renewing token:', error);
      }
    } else {
      console.error('Error seen notifications');
    }
  }

  console.log(notifications);

  return (
    <div className={notificationContainer} style={
      {
        top: props.top > 53.6 ? '0' : `${53.6 - props.top}px`,
        right: props.widths.infoWidth + props.widths.logoutWidth + - widthNotification / 2 + 36 + 'px'
      }
    }>
      <div className={notification} style={{ minWidth: widthNotification + 'px' }}>
        <ul style={{ padding: '0', margin: '0' }}>
          {
            notifications?.map((item) => {
              return (
                <li
                  style={{ listStyleType: 'none' }}
                  key={item.notificationId}
                  onClick={() => handleNotificationClick(item.notificationId, item.type, item.isCheck)}
                >
                  <div className={item.isCheck ? notificationItem : notificationItemCheck}>
                    <div className={notificationTitle}>
                      {item.title}
                    </div>
                    <div className={notificationContent}>
                      {item.content}
                    </div>
                    <div className={notificationTime}>
                      {item.timeSinceCreation}
                    </div>
                  </div>
                </li>
              )
            })
          }
          <li
            className={notificationSeen}
            style={{ listStyleType: 'none' }}
            onClick={handleNotificationClickAll}
          >
            Đã đọc tất cả
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Notification;
