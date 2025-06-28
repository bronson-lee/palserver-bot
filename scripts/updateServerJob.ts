import cron from 'node-cron'
import { isServerOnline, updateServer } from '../service/apiService';
import CommandLock from '../models/commandLock';

const handleUpdateSuccess = (startTime : number ) => {
    const endTime = new Date().getTime()
    const delta : number = (endTime - startTime) / 1000
    console.log(`Scheduled update finished in ${delta} seconds`)
}

export default () => {
    cron.schedule('0 3 * * *', async () => {
        const serverIsOnline = await isServerOnline()
        if(serverIsOnline) {
            console.log("Wanted to run scheduled update but server is online. Will delay update job.")
            return
        }

        console.log("Running scheduled update.")
        CommandLock.lock()
        const start = new Date().getTime()
        updateServer(true).then(() => handleUpdateSuccess(start)).catch((err) => {
            console.error("Will retry update once more.", err)
            return updateServer(true).then(() => handleUpdateSuccess(start)).catch((err) => {
                console.error(err, "Update failed twice. Manual update may be required.")
            })
        }).finally(CommandLock.unlock)
    });
}

