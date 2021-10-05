var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();
var AWS = require("aws-sdk");
var db = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
var uuid = require("uuid");

module.exports = api;

api.registerAuthorizer("midterm-aryandc-auth-pool", {
  providerARNs: [
    "arn:aws:cognito-idp:us-west-2:003344594004:userpool/us-west-2_lWpXg0QJj",
  ],
});

// // gets the full list of songs
// api.get(
//   "/songs",
//   (req) => {
//     var params = { TableName: "songs" };
//     return db
//       .scan(params)
//       .promise()
//       .then((resp) => resp.Items);
//   },
//   {
//     cognitoAuthorizer: "midterm-aryandc-auth-pool",
//     authorizationScope: ["email"],
//   }, { success: 200 }
// );

// // gets the song with given uid
// api.get("/songs/{uid}", (req) => {
//   var params = {
//     TableName: "songs",
//     FilterExpression: "#uid = :uid",
//     ExpressionAttributeNames: {
//       "#uid": "uid",
//     },
//     ExpressionAttributeValues: {
//       ":uid": req.pathParams.uid,
//     },
//   };

//   return db
//     .scan(params)
//     .promise()
//     .then((resp) => resp.Items);
// }, { success: 200 });

// // gets all songs created by user
// api.get("/songs/user/{username}", (req) => {
//   var params = {
//     TableName: "songs",
//     FilterExpression: "#username=:u",
//     ExpressionAttributeNames: {
//       "#username": "username",
//     },
//     ExpressionAttributeValues: {
//       ":u": req.pathParams.username,
//     },
//   };
//   return db
//     .scan(params)
//     .promise()
//     .then((resp) => resp.Items);
// }, {
//     cognitoAuthorizer: "midterm-aryandc-auth-pool",
//     authorizationScope: ["email"],
//   }, { success: 200 });

// gets 10 songs from the startKey
api.get(
  "/songs/next/{startKey}",
  (req) => {
    const startKey = req.pathParams.startKey;
    var params = {};

    if (startKey === null || startKey.length === 0) {
      params = {
        TableName: "songs",
        Limit: 10,
      };
    } else {
      params = {
        TableName: "songs",
        Limit: 10,
        ExclusiveStartKey: {
          uid: startKey,
        },
      };
    }

    return db
      .scan(params)
      .promise()
      .then((resp) => {
        return {
          status: 200,
          startKey: startKey,
          songList: resp.Items,
          lastEvaluatedKey: resp.LastEvaluatedKey,
        };
      });
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  { success: 200 }
);

// gets first 10 songs in the dynamodb database
api.get(
  "/songs/next",
  (req) => {
    var params = {
      TableName: "songs",
      Limit: 10,
    };
    return db
      .scan(params)
      .promise()
      .then((resp) => {
        return {
          status: 200,
          songList: resp.Items,
          lastEvaluatedKey: resp.LastEvaluatedKey,
        };
      });
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  { success: 200 }
);

// delete a song with specified uid and username from the dynamo database
api.delete(
  "/songs/user/{username}/id/{uid}",
  (req) => {
    var uid = req.pathParams.uid;
    var username = req.pathParams.username;
    const params = {
      TableName: "songs",
      Key: {
        uid: uid,
      },
      ConditionExpression: "#username = :u",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":u": req.pathParams.username,
      },
    };
    return db
      .delete(params)
      .promise()
      .then(() => {
        var result = {
          status: 200,
          message: "Deleted song with uid " + uid + " and username " + username,
        };
        return result;
      });
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  { success: 200 }
);

// update a song data with the given uid and username
api.put(
  "/songs/user/{username}/id/{uid}",
  (req) => {
    var params = {
      TableName: "songs",
      Key: {
        uid: req.pathParams.uid,
      },
      UpdateExpression:
        "set #artist=:ar, #album=:al, #song=:s, #cover_img=:ci, #youtube_link=:yt, #release_year=:rl",
      ConditionExpression: "#username=:u",
      ExpressionAttributeNames: {
        "#artist": "artist",
        "#album": "album",
        "#song": "song",
        "#cover_img": "cover_img",
        "#youtube_link": "youtube_link",
        "#release_year": "release_year",
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":ar": req.body.artist,
        ":al": req.body.album,
        ":ci": req.body.cover_img,
        ":yt": req.body.youtube_link,
        ":rl": req.body.release_year,
        ":s": req.body.song,
        ":u": req.pathParams.username,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return db
      .update(params)
      .promise()
      .then(() => {
        var result = {
          status: 200,
          message:
            "Updated song with uid " +
            req.pathParams.uid +
            " and username " +
            req.pathParams.username,
        };

        return result;
      });
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  { success: 200 }
);

// post song data to the dynamodb database
api.post(
  "/songs",
  (req) => {
    var params = {
      TableName: "songs",
      Item: {
        uid: uuid.v1(),
        album: req.body.album,
        artist: req.body.artist,
        song: req.body.song,
        cover_img: req.body.cover_img,
        release_year: req.body.release_year,
        youtube_link: req.body.youtube_link,
        username: req.body.username,
      },
    };

    if (req.body.song === "") {
        return {
            status: 200,
            message: "Song field cannot be empty"
        }
    }

    return db
      .put(params)
      .promise()
      .then(() => {
        var result = {
          status: 200,
          message: "Sucessfully posted data point to DynamoDB",
        };
        return result;
      });
  },
  {
    cognitoAuthorizer: "midterm-aryandc-auth-pool",
    authorizationScope: ["email"],
  },
  { success: 200 }
);
