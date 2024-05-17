import axios from 'axios';

import { QLREQUEST_API, GET_REQUEST_SUB } from '../../layout/constants';

export const getRequest = async (data) => {
    try {
        const response = await axios.get(`${QLREQUEST_API}${GET_REQUEST_SUB}`, {
            params: data
        });
        return response;
    } catch (error) {
        return error;
    }
};