import axios from 'axios';

import { NOTIFICATION_API, SEEN_NOTIFICATION_SUB } from '../../layout/constants';

export const seenNotification = async (config, id) => {
    try {
        const response = await axios.put(`${NOTIFICATION_API}${id}`, {
            headers: config
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Unauthorized' };
        }
        if (error.response && error.response.status === 403) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'AccessDenied' };
        }
        return null;
    }
};