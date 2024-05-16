import axios from 'axios';

import { NOTIFICATION_API, GET_NOTIFICATION_SUB } from '../../layout/constants';

export const getNotification = async (config) => {
    try {
        const response = await axios.get(`${NOTIFICATION_API}${GET_NOTIFICATION_SUB}`, {
            headers: config
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Unauthorized' };
        }
        // else if (error.response && error.response.status === 400) {
        //     // Nếu lỗi là 401, trả về lỗi để xử lý trong component
        //     return { error: 'Date' };
        // }
        // Nếu lỗi không phải là 401, trả về null
        return null;
    }
};