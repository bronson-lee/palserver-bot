export const isServerOnline = async () : Promise<boolean> => {
    return fetch('http://localhost:8212/v1/api/info', {
        headers: {
            Authorization: 'Basic YWRtaW46YWRtaW4='
        }
    }).then((response) => {
        return response.status == 200
    }).catch((err) => {
        return false
    })
}