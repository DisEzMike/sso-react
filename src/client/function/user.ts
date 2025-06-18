import axios from 'axios'
import { API_URL } from '../utils/contant';

export const getUser = async () => {
    const token = sessionStorage.getItem("token");
    return axios.get(API_URL + '/me', {
        headers: {
            Authorization: "Bearer " + token
        }
    })
}