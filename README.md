# CryoEM Project

![CryoEM UI Screenshot](cover.png?raw=true "CryoEM")

The CryoEM Training Tool is prototype meant to train users on identifying good sample selections.

## How to start :

##### Step 0 : Add the required Cryo Images
Please add the images under client/src/assets/ in a new folder names cryo_imgs.
The structure of the client src folder should look like this for the images to be properly accesed :

```
|-- src 
|   |-- assets 
|   |   |-- cryo_imgs
|   |   |   |-- <img name 1>
|   |   |   |-- <img name 2>
|   |   |   |-- ...

```

The mapping between image file names and server/files/target_Y4.json should match.
The image file name format should follow the format below: 
```
Format: [date]_[level]_[index][abbreviation of level].png
Example: 22mar04e_grid_00022gr.png
```

##### Step 1 : Start the server
In a terminal, from the root directory of this project, enter the server folder. If you are starting the project for the first time and haven't installed the project dependencies, you will have to do so.

```
cd server
npm install         # install the required dependencies
npm start           # start the server
```

##### Step 2 : Start the client
In anoter terminal, from the root directory of this project, enter the client folder. If you are starting the project for the first time and haven't installed the project dependencies, you will have to do so.

```
cd client
npm install         # install the required dependencies
npm run start       # start the client
```

This will start the server and run the CryoEM Training App, accessible at http://localhost:3000.


##### Step 3 : Get users results
Users' results are saved under the file results.json, which is located under the server folder. Users' results are persistent between run and are structures as follow :

```
[
    {
        "trajectory": [
            {
                "target_name": <str>,
                "ctf": <str>
            },
            ...
        ],
        "total_time": <int> in seconds,
        "time_in_inspection_mode": <int> in seconds,
        "time_in_queue_mode": <int> in seconds
    },
    ...
]
```

##### Step 4 : Run the project using docker (optional)
This project is fully dockerized and can easily be ran using the following docker commands from the root directory:

```
# build the CryoEM image
docker build -t cryoem .       

# run the image in a local docker container
docker run -d --name mycryoem -p 8081:8081 cryoem

# to stop the container : 
docker stop mycryoem

# to restart the container : 
docker start mycryoem

```

CryoEM app available at this url : http://localhost:8081
Users results are accessible here : http://localhost:8081/results

Please note that if you kill the container, this will wipe the user results.json file.


## Contributor

IBM Research: Quanfu Fan, John Cohn

MIT-IBM Watson AI Lab Advanced Prototyping Team: Ja Young Lee, Veronique Demers, Lucy Yip