import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios'
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
    timeout: 1000,
    headers: {
        "Authorization": 'Basic YWRtaW46YWRtaW4='
    }
})

palworldClient.interceptors.response.use(handleClientResponse, handleClientErrors)

export const getInfo = () : Promise<PalworldServerInfoResponse> => palworldClient.get('v1/api/info')

export const getPlayers = () : Promise<PalworldPlayersResponse> => palworldClient.get('v1/api/players')

export const saveGame = () : Promise<void> => palworldClient.post('v1/api/save')

export const stopGame = () : Promise<void> => palworldClient.post('v1/api/stop')