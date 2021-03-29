const fs = require('fs');
const defaultFileLocation = './scheduledJobs.json';

const msPerMinute = 60000;

function FilePersistence(pathForFile) {
    const fileLocation = typeof pathForFile === 'string' ? pathForFile : defaultFileLocation;

    function getJson() {
        try {
            const contents = fs.readFileSync(fileLocation, 'utf8');
            return JSON.parse(contents);
        } catch (err) {
            return [];
        }
    }

    function putJson(data) {
        fs.writeFileSync(fileLocation, JSON.stringify(data));
    }

    return {
        getJson,
        putJson
    }
}

function Scheduler(persistence) {
    if (typeof persistence.getJson !== 'function' || typeof persistence.putJson !== 'function')
        throw new Error('Invalid persistence module passed to Schedule')

    function getAllTasks() {
        return persistence.getJson() || [];
    }

    function getTasksToRun(startTime) {
        const jobs = persistence.getJson() || [];
        return jobs.filter(j => j.time <= startTime);
    }

    function removeTask(timestamp) {
        const jobs = persistence.getJson() || [];
        const updated = jobs.filter(j => j.time !== timestamp);
        persistence.putJson(updated);
    }

    function scheduleTask(time, action) {
        if (time < 0 || !action)
            return;

        //const msFromNow = time * msPerMinute;

        const logEntry = {
            time,
            action
        }
        appendJsonData(logEntry)
    }

    return {
        getAllTasks,
        getTasksToRun,
        removeTask,
        scheduleTask
    }

    function appendJsonData(data) {
        const currentData = persistence.getJson() || [];
        const newData = currentData.concat(data);
        persistence.putJson(newData);
    }

}


module.exports = {
    FilePersistence,
    Scheduler
}