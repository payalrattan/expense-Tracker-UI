import { BASE_URL } from '@/data/expenseTrackerAPI/expenseTrackerApi';
import axios from 'axios';

export const axiosService = axios.create({
    baseURL : BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
