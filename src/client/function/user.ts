import axios from 'axios'
import { API_URL } from '../utils/contant';
import { refreshToken } from './auth';
import { IUser } from '../../server/src/database/model/User';

export const getUser = async () => {
    const token = sessionStorage.getItem("token");
    return axios.get(API_URL + '/me', {
        headers: {
            Authorization: "Bearer " + token
        }
    })
    .catch((err) => {
        console.error(err)
        refreshToken(getUser)
    });
}