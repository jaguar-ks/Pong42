import axios from 'axios';

const Api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    timeout: 5000,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
});

export default Api;
