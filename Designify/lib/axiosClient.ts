import axios from "axios";

export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STRAPI_URL + '/api',
    headers: {
        Authorization: `Bearer ` + process.env.STRAPI_API_TOKEN
    }
})