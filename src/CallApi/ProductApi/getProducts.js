import axios from 'axios';

import { PRODUCT_API, PRODUCT_SUB } from '../../layout/constants';

export const getProducts = async (config, data) => {
    try {
        const response = await axios.get(`${PRODUCT_API}${PRODUCT_SUB}`, {
            params: data
        }, config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Data' };
        }
        if (error.response && error.response.status === 403) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'AccessDenied' };
        }
        return null;
    }
};