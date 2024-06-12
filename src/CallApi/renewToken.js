import axios from 'axios';

import { RENEW_TOKEN_API } from '../layout/constants';

export const renewToken = async (oldToken, navigate) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await axios.post(RENEW_TOKEN_API, oldToken.refreshToken, config);
        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };
    } catch (error) {
        if(error.response && error.response.status === 401) {
            if (navigate) {
                alert('Phiên đăng nhập hết hạn!')
                navigate('/Login');
            }
        }
        throw error;
    }
};