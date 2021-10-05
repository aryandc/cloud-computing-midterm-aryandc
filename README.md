# Music Library
Link to the website: [music-library.ga](https://music-library.ga/)

### Requirement
* Node.js

## How to build the project

* Clone the project from the terminal using ``` git clone https://github.com/aryandc/cloud-computing-midterm-aryandc.git ```.
* There are two folders at project root.
    * app (React app)
    * claudia-app (Created APIs using Lambda)

#### Config File
* Create a config.json file with the following informations:

```
{
  "userPoolID":         <COGNITO USER POOL ID>,
  "clientID":           <COGNITO USER POOL CLIENT ID>,
  "identityPoolID":     <COGNITO IDENTITY POOL ID>,
  "region":             <COGNITO POOL REGION>,
  "userPoolARN":        <COGNITO USER POOL ARN>,
  "userPoolName":       <COGNITO USER POOL NAME>
}
```
* Paste this `config.json` file at the folders:
    * `<project_root>/app/src`
    * `<project_root>/claudia_app`

#### How to build React App

* Go to the app folder using ``` cd <path_to_project_root>/app ```.
* Install the node.js dependencies using ``` npm install ```.
* Start the react app using ``` npm run start ```
    * This will start the application at a `PORT` (default value is `3000`).
* Go to your browser and execute ``` localhost:3000 ``` or ``` localhost:<PORT> ```, if the app is running of different port.

#### How to build Claudia App
#### See: [Setup Claudia](https://claudiajs.com/tutorials/hello-world-api-gateway.html)

* Go to the app folder using ``` cd <path_to_project_root>/claudia-app ```.
* Install the node.js dependencies using ``` npm install ```.
* To deploy the lambda function, run `claudia update`.

# Music Library
Link to the website: [music-library.ga](https://music-library.ga/)

### Requirement
* Node.js

## How to build the project

* Clone the project from the terminal using ``` git clone https://github.com/aryandc/cloud-computing-midterm-aryandc.git ```.
* There are two folders at project root.
    * app (React app)
    * claudia-app (Created APIs using Lambda)

#### Config File
* Create a config.json file with the following informations:

```
{
  "userPoolID":         <COGNITO USER POOL ID>,
  "clientID":           <COGNITO USER POOL CLIENT ID>,
  "identityPoolID":     <COGNITO IDENTITY POOL ID>,
  "region":             <COGNITO POOL REGION>,
  "userPoolARN":        <COGNITO USER POOL ARN>,
  "userPoolName":       <COGNITO USER POOL NAME>
}
```
* Paste this `config.json` file at the folders:
    * `<project_root>/app/src`
    * `<project_root>/claudia_app`

#### How to build React App

* Go to the app folder using ``` cd <path_to_project_root>/app ```.
* Install the node.js dependencies using ``` npm install ```.
* Start the react app using ``` npm run start ```
    * This will start the application at a `PORT` (default value is `3000`).
* Go to your browser and execute ``` localhost:3000 ``` or ``` localhost:<PORT> ```, if the app is running of different port.

### How to test the API

#### Endpoints
* `GET /songs/next`
    * Get first 10 songs form the database.
* `GET /songs/next/{startKey}`
    * Gets 10 songs after the song with uid `startkey`.
* `DELETE /songs/user/{username}/id/{uid}`
    * Delete song with uid `uid` and created by `username`.
* `PUT /songs/user/{username}/id/{uid}`
    * Update song with uid `uid` and created by `username`
* `POST /songs`
    * Adds a song data in the dynamo database

#### Postman
* Create a new request and add `<your invoke url>/<endpoint>`
* Click on the Header table under the request and add your ID token.
    * Add as `key: Authorization` and `value: ID Token`.
* For Post and Put method, add to the body of the request in json format as show below:
```
{
        "album": "After Hours",
        "artist": "The Weeknd",
        "song": "Blinding Light (Audio)",
        "cover_img": "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
        "release_year": 2020,
        "uid": "54b01de0-2404-11ec-9dd6-73fcf7773ed8",
        "youtube_link": "https://www.youtube.com/watch?v=4NRXx6U8ABQ&list=PLPRWtKgY2MOu8dPE7sMxQZ07PS1mLqid9&index=9"
    }
```

