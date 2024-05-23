import axios from 'axios';

import { QLORDER_API, BILL_ORDER_SUB } from '../../layout/constants';

export const getBill = async (config, id) => {
    try {
        const response = await axios.get(`${QLORDER_API}${BILL_ORDER_SUB}?tableId=${id}`, config);
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
        // Nếu lỗi không phải là 401, trả về null
        return null;
    }
};