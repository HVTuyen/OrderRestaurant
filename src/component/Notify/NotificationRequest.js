import React, { useState } from 'react';
import clsx from 'clsx'
import style from './notify.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'

const NotificationRequest = () => {
  

  const notificationContainerRequest = clsx(style.notificationContainerRequest)
  const notification = clsx(style.notification)

  return (
    <div className={notificationContainerRequest}>
        <div className={notification}>
            <FontAwesomeIcon icon={faBell} style={{paddingRight:'8px'}}/>
            Có yêu cầu mới!
        </div>
    </div>
  );
};

export default NotificationRequest;
