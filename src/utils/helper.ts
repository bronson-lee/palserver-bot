import type { AxiosError, AxiosResponse } from "axios";
import logger from "./logger";

export const colorHttpMethod = (httpMethod: string | undefined) => {
    let colorValue = ""
    switch (httpMethod) {
        case "GET":
            colorValue = '\x1b[32m'
            break;
        case "POST":
            colorValue = '\x1b[36m'
            break;
        case "DELETE":
            colorValue = '\x1b[31m'
            break;
        case "PUT":
            colorValue = '\x1b[35m'
            break;
        case "PATCH":
            colorValue = '\x1b[33m'
            break;
    }
    return `${colorValue}${httpMethod}\x1b[0m`
}

export const colorHttpStatus = (status : number | string | undefined) : string => {
    if(!status) {
        return ""
    }

    if(typeof status === 'string') {
        status = parseInt(status)
    }

    let colorValue = ""
    switch (Math.floor(status / 100)) {
        case 2:
            colorValue = '\x1b[32m'
            break;
        case 3:
            colorValue = '\x1b[36m'
            break;
        case 4:
            colorValue = '\x1b[33m'
            break;
        case 5:
            colorValue = '\x1b[31m'
            break;
        default:
            break;
    }
    return colorValue + status.toString() + '\x1b[0m'
}

export const handleClientErrors = (error : AxiosError<any>) => {
    logger.proxy(`${colorHttpMethod(error.config?.method?.toUpperCase())} ${error.config?.baseURL}/${error.config?.url} ${colorHttpStatus(error.status)}`)
    return Promise.reject(error)
}

export const handleClientResponse = (response : AxiosResponse) : any => {
    logger.proxy(`${colorHttpMethod(response.config?.method?.toUpperCase())} ${response.config.baseURL}/${response.config.url} ${colorHttpStatus(response.status)}`)
    return response.data
}