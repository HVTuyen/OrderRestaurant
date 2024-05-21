import axios from 'axios';

import { CATEGORY_API } from '../../layout/constants';

export const createCategory = async (config, data) => {
    try {
        const response = await axios.post(CATEGORY_API, data, config);
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