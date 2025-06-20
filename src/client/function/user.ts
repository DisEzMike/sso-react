import axios from 'axios'
import { API_URL } from '../utils/contant';
import { refreshToken } from './auth';

export const getUser = async () => {
    try {
        const token = JSON.parse(localStorage.getItem("token")!);
        return await axios.get(API_URL + '/me', {
            headers: {
                Authorization: "Bearer " + token.access_token
            }
        })
    } catch (error) {
        return await refreshToken(getUser)
    }
}