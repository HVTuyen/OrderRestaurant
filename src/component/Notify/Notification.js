import React, { useState } from 'react';
import clsx from 'clsx'
import style from './notify.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'

const Notification = (props) => {
  

  const notificationContainer = clsx(style.notificationContainer)
  const notification = clsx(style.notification)
  const widthNotification = 240

  return (
    <div className={notificationContainer} style={
            { 
                top: props.top > 53.6 ? '0' : `${53.6 - props.top}px`, 
                right: props.widths.infoWidth + props.widths.logoutWidth + - widthNotification/2 + 36 + 'px'
            }
        }>
        <div className={notification} style={{minWidth: widthNotification + 'px'}}>
            <ul style={{padding:'4px', margin:'0'}}>
                <li style={{listStyleType:'none'}}>123</li>
                <li style={{listStyleType:'none'}}>123</li>
                <li style={{listStyleType:'none'}}>123</li>
                <li style={{listStyleType:'none'}}>123</li>
            </ul>
        </div>
    </div>
  );
};

export default Notification;
