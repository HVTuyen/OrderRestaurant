import axios from 'axios';

import { STATISTICAL_API, REVENUE_SUB } from '../../layout/constants';

export const getRevenue = async (config, date) => {
    try {
        const response = await axios.get(`${STATISTICAL_API}${REVENUE_SUB}`, {
            params: date,
            headers: config
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Unauthorized' };
        }
        else if (error.response && error.response.status === 400) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Date' };
        }
        // Nếu lỗi không phải là 401, trả về null
        return null;
    }
};