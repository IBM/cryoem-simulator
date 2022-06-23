
import { API_URL } from './config';

export const unavlbl_img = (style = {}) => <div className='unavailable_img' style={style}>Image not Available</div>


export const getImagePath = (path) => {
    return (path.toString().slice(-4) === "_v02") ? path.toString().slice(0, -4) : path 
}

export const checkFileExist = (path) => {
    try {
        return require(`./assets/cryo_imgs/${getImagePath(path)}.png`);
    } catch (e) {
        return null;
    }
};

export const requireFile = (path) => {
    const newPath = getImagePath(path)
    try {
        if(require(`./assets/cryo_imgs/${newPath}.png`).default === undefined) {
            return require(`./assets/cryo_imgs/${newPath}.png`);
        }

        return require(`./assets/cryo_imgs/${newPath}.png`).default;
    } catch (e) {
        return null;
    }
};

export function postResults(dataLog, {totalTime, timeInQueue}) {
    const body = {
        trajectory: dataLog,
        total_time: totalTime,
        time_in_inspection_mode : totalTime - timeInQueue,
        time_in_queue_mode: timeInQueue
    };


    fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body)
    })
    .then(res => {return res.text()})
    .then(data => {
        console.log(data)
    })
    .catch((error) => console.error('Error:', error));
}

export function downloadJSON(array) {
    const timeStamp = new Date().toISOString();

    //Convert JSON Array to string.
    var json = JSON.stringify(array);

    //Convert JSON string to BLOB.
    json = [json];
    var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

    //Check the Browser.
    var isIE = false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveBlob(blob1, `${timeStamp}.json`);
    } else {
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob1);
        var a = document.createElement("a");
        a.download = `${timeStamp}.json`;
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}