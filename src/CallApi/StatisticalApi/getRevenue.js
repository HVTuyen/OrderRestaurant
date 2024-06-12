import axios from 'axios';

import { STATISTICAL_API, REVENUE_SUB } from '../../layout/constants';

export const getRevenue = async (config, date) => {
    try {
        const response = await axios.get(`${STATISTICAL_API}${REVENUE_SUB}?startDate=${date.startDate}&endDate=${date.endDate}`, config);
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
        if (error.response && error.response.status === 400) {
            // Nếu lỗi là 401, trả về lỗi để xử lý trong component
            return { error: 'Date' };
        }
        return null;
    }
};