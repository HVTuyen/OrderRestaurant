import axios from 'axios';

import { QLORDER_API, DELETE_ORDER_DETAIL_SUB } from '../../layout/constants';

export const deleteOrderDetail = async (config, orderId, foodId) => {
    try {
        const response = await axios.delete(`${QLORDER_API}${DELETE_ORDER_DETAIL_SUB}/${orderId}/${foodId}`, config);
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