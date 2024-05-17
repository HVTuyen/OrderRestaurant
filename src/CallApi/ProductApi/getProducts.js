import axios from 'axios';

import { PRODUCT_API } from '../../layout/constants';

export const getProducts = async (config) => {
    try {
        const response = await axios.get(PRODUCT_API, config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Unauthorized' };
        }
        // Nếu lỗi không phải là 401, trả về null
        return null;
    }
};