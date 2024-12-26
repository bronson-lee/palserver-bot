import { exec } from 'child_process'

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

export const startServer = () => {
    const shellCommand = 'sudo systemctl start palserver'
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(err || stderr)
                reject(`Error executing start command ${err || stderr}`)
            }
            resolve(stdout)
        })
    })
}

export const stopServer = () => {
    const shellCommand = `sudo systemctl stop palserver`
    return new Promise((resolve, reject) => {
        exec(shellCommand, (err, stdout, stderr) => {
            if (err || stderr) {
                reject(`Error executing stop command ${err || stderr}`)
            }

            resolve(stdout)
        })
    })
    
}