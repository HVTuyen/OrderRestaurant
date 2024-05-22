import axios from 'axios';

import { QLREQUEST_API, REQUEST_REFUSE_SUB } from '../../layout/constants';

export const refuseRequest = async (config, id) => {
    try {
        const response = await axios.post(`${QLREQUEST_API}${REQUEST_REFUSE_SUB}/${id}`, null, config);
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