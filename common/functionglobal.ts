import { notification } from "antd"
import { persistor, store } from "@/common/configureStore";
import axios from "axios";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export function mapSelectAntd(list: Array<any>, label: string, value: string) {
    return list.map((obj: any) => {
        return {
            value: obj[value],
            label: obj[label],
        }
    })
}

export async function sendRequestLogin_$POST(url: string, { arg }: any) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg),
    }).then(res => res.json())
}

export function inforCurrentUser() {
    const state = store.getState();
    return state?.infoCurrentUserReducers;
}

export function configheader(token: string) {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    }
}

export function fetcher_$GET(url: any) {
    const state = store.getState();
    let token = state?.infoCurrentUserReducers?.token;
    return axios.get(url, configheader(token)).then((res) => res.data);
}

export function fetcher_$POST(url: any, { arg }: any) {
    const state = store.getState();
    let token = state?.infoCurrentUserReducers?.token;
    return axios.post(url, arg, configheader(token)).then((res) => res.data);
}

export function fetcher_$DELETE(url: any) {
    const state = store.getState();
    let token = state?.infoCurrentUserReducers?.token;
    return axios.delete(url, configheader(token)).then((res) => res.data);
}

export function notificationSuccess(description: string) {
    return notification.success({
        message: 'Thông báo',
        description: description,
        duration: 2,
        placement: 'topRight'
    })
}

export function notificationError(description: string) {
    return notification.error({
        message: 'Thông báo',
        description: description,
        duration: 2,
        placement: 'topRight'
    })
}

export function deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export function formatDate(value: any) {
    return dayjs(value).format('DD/MM/YYYY');
}