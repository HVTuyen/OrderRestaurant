import axios from 'axios';

import { NOTIFICATION_API, SEEN_NOTIFICATION_ALL_SUB } from '../../layout/constants';

export const seenNotificationAll = async (config) => {
    try {
        const response = await axios.put(`${NOTIFICATION_API}${SEEN_NOTIFICATION_ALL_SUB}`, {
            headers: config
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Unauthorized' };
        }
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'AccessDenied' };
        }
        return null;
    }
};