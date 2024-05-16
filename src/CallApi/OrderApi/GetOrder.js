import axios from 'axios';

import { QLORDER_API, GET_ORDER_SUB } from '../../layout/constants';

export const getOrder = async (data) => {
    try {
        const response = await axios.get(`${QLORDER_API}${GET_ORDER_SUB}`, {
            params: data
        });
        return response;
    } catch (error) {
        return error;
    }
};