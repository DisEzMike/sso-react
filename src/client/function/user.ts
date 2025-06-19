import axios from 'axios'
import { API_URL } from '../utils/contant';
import { refreshToken } from './auth';

export const getUser = async () => {
    const token = sessionStorage.getItem("token");
    try {
        return await axios.get(API_URL + '/me', {
            headers: {
                Authorization: "Bearer " + token
            }
        })
    } catch (error) {
        return await refreshToken(getUser)
    }
}