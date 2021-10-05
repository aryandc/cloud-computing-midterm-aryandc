# Music Library

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

