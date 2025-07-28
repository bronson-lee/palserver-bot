import axios from 'axios';
import type { AxiosInstance } from 'axios'
import { handleClientErrors, handleClientResponse } from '../utils/helper';

export type PalworldServerInfoResponse = {
    version: string,
    servername: string,
    description: string,
    worldguid: string
}

export type PalworldPlayersResponse = {
    players: PalworldPlayer[],
}

export type PalworldPlayer = {
    name: string,
    accountName: string,
    playerId: string,
    userId: string,
    ip: string,
    ping: string,
    location_x: string,
    location_y: string,
    level: string,
    building_count: string,
}

const palworldClient : AxiosInstance = axios.create({
    baseURL: 'http://localhost:8212',
    timeout: 10000,
    headers: {
        "Authorization": 'Basic YWRtaW46YWRtaW4=',
        'content-type': 'application/json'
    }
})

palworldClient.interceptors.response.use(handleClientResponse, handleClientErrors)

export const getInfo = () : Promise<PalworldServerInfoResponse> => palworldClient.get('v1/api/info')

export const getPlayers = () : Promise<PalworldPlayersResponse> => palworldClient.get('v1/api/players')

export const saveGame = () : Promise<void> => palworldClient.post('v1/api/save')

export const stopGame = (timeMs : number = 1, message : string = "") : Promise<void> => palworldClient.post('v1/api/shutdown', { "waittime": timeMs, "message": message })