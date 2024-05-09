import axios from 'axios';

import { RENEW_TOKEN_API } from '../layout/constants';

export const renewToken = async (oldToken, navigate) => {
    try {
        const response = await axios.post(RENEW_TOKEN_API, oldToken);
        const { accessToken, refreshToken } = response.data.data;
        return { accessToken, refreshToken };
    } catch (error) {
        if(error.response && error.response.status === 401) {
            if (navigate) {
                navigate('/Login');
            }
        }
        throw error;
    }
};