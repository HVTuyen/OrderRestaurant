import axios from 'axios';

import { QLORDER_API, UPDATE_ORDER_DETAIL_SUB } from '../../layout/constants';

export const UpdateOrderDetail = async (config, orderId, data) => {
    try {
        const response = await axios.put(`${QLORDER_API}${UPDATE_ORDER_DETAIL_SUB}/${orderId}`, data, config);
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
    }
};