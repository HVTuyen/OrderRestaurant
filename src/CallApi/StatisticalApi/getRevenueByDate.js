import axios from 'axios';

import { STATISTICAL_API } from '../../layout/constants';

export const getRevenueByDate = async (config, date) => {
    try {
        const response = await axios.get(STATISTICAL_API, date, config);
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