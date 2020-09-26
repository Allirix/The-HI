const axios = require("axios");
var Apicalypse = require("Apicalypse");
console.log(Apicalypse);

var c = require("bottender/dist/getClient.js").default("messenger");

var a = async () => {
  var CLIENT_ID = "3v5j2b8fnsogq19rmuy0kl0ummbdjo";
  var CLIENT_SECRET = "nkax4fyq7wpuf58agl8o5mywsobiul";
  var url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
  axios({
    url: url,
    method: "POST",
  })
    .then((response) => {
      var access_token = response.data.access_token;
      console.log(response.data.access_token);
      axios({
        url: "https://api.igdb.com/v4/games",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
        },
        data: "fields name, similar_games, alternative_names;",
      })
        .then((response) => {
          console.log(response.data);
          console.log(response.data.length);
        })
        .catch((err) => {
          console.log("ERROR GETTING DATA");
        });
    })
    .catch((err) => {
      //console.error(err);
      console.log("ERROR GETTING OATH TOKEN");
    });
};

var users = {
  // 3002892476483747: {
  //   id: "3002892476483747",
  //   status: "dormant",
  //   idConnected: null,
  // },
  // '3302886089759936': {
  //   id: '3302886089759936',
  //   status: 'connected',
  //   idConnected: '4320686504671599'
  // }
};

function BroadcastDeals() {
  users.forEach((element) => {
    if (element.status == "subscribed") {
      send(element.id, "subscription yet to be built");
    }
  });
}

setInterval(BroadcastDeals, 1000 * 60 * 60 * 24);

var games = {
  39455: {
    id: 39455,
    name: "Insector X",
    similar_games: [
      27270,
      43367,
      103281,
      103292,
      103298,
      103301,
      105049,
      106805,
      113598,
    ],
  },
};

var stores = [
  {
    storeID: "1",
    storeName: "Steam",
  },
  {
    storeID: "2",
    storeName: "GamersGate",
  },
  {
    storeID: "3",
    storeName: "GreenManGaming",
  },
  {
    storeID: "4",
    storeName: "Amazon",
  },
  {
    storeID: "5",
    storeName: "GameStop",
  },
  {
    storeID: "6",
    storeName: "Direct2Drive",
  },
  {
    storeID: "7",
    storeName: "GoG",
  },
  {
    storeID: "8",
    storeName: "Origin",
  },
  {
    storeID: "9",
    storeName: "Get Games",
  },
  {
    storeID: "10",
    storeName: "Shiny Loot",
  },
  {
    storeID: "11",
    storeName: "Humble Store",
  },
  {
    storeID: "12",
    storeName: "Desura",
  },
  {
    storeID: "13",
    storeName: "Uplay",
  },
  {
    storeID: "14",
    storeName: "IndieGameStand",
  },
  {
    storeID: "15",
    storeName: "Fanatical",
  },
  {
    storeID: "16",
    storeName: "Gamesrocket",
  },
  {
    storeID: "17",
    storeName: "Games Republic",
  },
  {
    storeID: "18",
    storeName: "SilaGames",
  },
  {
    storeID: "19",
    storeName: "Playfield",
  },
  {
    storeID: "20",
    storeName: "ImperialGames",
  },
  {
    storeID: "21",
    storeName: "WinGameStore",
  },
  {
    storeID: "22",
    storeName: "FunStockDigital",
  },
  {
    storeID: "23",
    storeName: "GameBillet",
  },
  {
    storeID: "24",
    storeName: "Voidu",
  },
  {
    storeID: "25",
    storeName: "Epic Games Store",
  },
  {
    storeID: "26",
    storeName: "Razer Game Store",
  },
  {
    storeID: "27",
    storeName: "Gamesplanet",
  },
  {
    storeID: "28",
    storeName: "Gamesload",
  },
  {
    storeID: "29",
    storeName: "2Game",
  },
  {
    storeID: "30",
    storeName: "IndieGala",
  },
  {
    storeID: "31",
    storeName: "Blizzard Shop",
  },
];

// (async () => {
//   const url = "https://www.cheapshark.com/api/1.0/stores";
//   axios
//     .get(url)
//     .then((Response) => {
//       console.log(Response.data);
//       return Response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return null;
//     });
// })();

async function SearchingResponse(context) {
  await context.sendGenericTemplate([
    {
      title: "Waiting",
      imageUrl:
        "https://dz9yg0snnohlc.cloudfront.net/is-it-normal-to-talk-to-random-people-online-1-new.jpg",
      subtitle: "Waiting for another user.",
      buttons: [
        {
          type: "postback",
          title: "Stop waiting",
          payload: "DEVELOPER_DEFINED_PAYLOAD",
        },
      ],
    },
  ]);
}

async function GoogleSearchTemplate(sendGenericTemplate, Response) {
  await sendGenericTemplate([
    {
      title: Response.items[0].title,
      imageUrl:
        "https://dz9yg0snnohlc.cloudfront.net/is-it-normal-to-talk-to-random-people-online-1-new.jpg",
      subtitle: "Waiting for another user.",
      buttons: [
        {
          type: "postback",
          title: "Stop waiting",
          payload: "DEVELOPER_DEFINED_PAYLOAD",
        },
      ],
    },
  ]);
}

async function StartReponse(context) {
  await context.sendGenericTemplate([
    {
      title: "Welcome to the Human Interface",
      imageUrl:
        "https://dz9yg0snnohlc.cloudfront.net/is-it-normal-to-talk-to-random-people-online-1-new.jpg",
      subtitle: "Connect to another user.",

      buttons: [
        {
          type: "postback",
          title: "Start",
          payload: "Start",
        },
      ],
    },
  ]);
}

const isNewUser = (user) => {
  return users[user.id] == undefined ? true : false;
};

function returnUser(user) {
  if (isNewUser(user)) {
    return addNewUser(user);
  } else {
    return findExistingUser(user.id);
  }
}

function addNewUser(user) {
  users[user.id] = {
    id: user.id,
    status: "dormant",
    idConnected: null,
  };
  console.log(`User ${user.id} was added to the database as:`);
  console.log(users[user.id]);
  return users[user.id];
}

function findExistingUser(id) {
  console.log(`User ${id} connected to server`);
  return users[id];
}

function connectUsers(userId, idConnected) {
  users[userId].idConnected = idConnected;
  changeStatus(userId, "connected");
  users[idConnected].idConnected = userId;
  changeStatus(idConnected, "connected");
}

function CheckIfWaiting(connectedUser, context) {
  var text;
  if (context.event.isText) {
    text = context.event.text;
  }
  if (context.event.isPayload) {
    text = context.event._rawEvent.postback.title;
  }
  if (text == "Start" || text == "DEMO - CONNECT TO SELF") {
    findUserToConnectTo(connectedUser, context);
  } else {
    console.log(`User ${connectedUser.id} was sent default template by bot`);
    StartReponse(context);
  }
}

function findUserToConnectTo(user, context) {
  var searchingUsers = ObjectFilter(users, (e) => e.status == "searching");
  searchingUsers = searchingUsers[Object.keys(searchingUsers)[0]];
  if (searchingUsers != undefined) {
    connectUsers(user.id, searchingUsers.id);
    send(user.id, `You have connected to someone. Send /exit to disconnect.`);
    send(
      searchingUsers.id,
      `You have connected to someone. Send /exit to disconnect.`
    );
  } else {
    console.log(`User ${user.id} was sent searching template by bot`);
    SearchingResponse(context);
    changeStatus(user.id, "searching");
  }
}

function disconnectUsers(userId, idConnected) {
  users[userId].idConnected = null;
  changeStatus(userId, "dormant");
  users[idConnected].idConnected = null;
  changeStatus(idConnected, "dormant");
  send(idConnected, "A user sent /exit which disconnects users");
  send(userId, "A user sent /exit which disconnects users");
}

function changeStatus(userId, status) {
  console.log(`User ${userId} changed status to ${status}`);
  users[userId].status = status;
}

function send(id, text) {
  console.log(`User ${id} was sent "${text}" by bot`);
  c.sendMessage(id, {
    text: text,
  });
}

module.exports = async function App(context) {
  context
    .getUserProfile()
    .then((user) => {
      var connectedUser = returnUser(user);
      if (context.event.isText) {
        if (context.event.text == "/deals") {
          CheapShark(user.id, context);
        }
      }
      switch (connectedUser.status) {
        case "connected":
          console.log("CONNECTED");
          send(connectedUser.idConnected, context.event.text);
          if (context.event.text == "/exit") {
            disconnectUsers(connectedUser.id, connectedUser.idConnected);
          }
          break;
        case "searching":
          if (context.event.isPayload) {
            if (
              context.event._rawEvent.postback.title == "DEMO - CONNECT TO SELF"
            ) {
              console.log();
              CheckIfWaiting(connectedUser, context);
            } else {
              changeStatus(connectedUser.id, "dormant");
              StartReponse(context);
              console.log(
                `User ${connectedUser.id} was sent default template by bot`
              );
            }
          } else {
            SearchingResponse(context);
          }
          break;
        case "dormant":
          CheckIfWaiting(connectedUser, context);
          break;
        default:
          StartReponse(context);
      }
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
};

// var a;
// axios
//   .get(
//     "https://api.the-odds-api.com/v3/odds/?sport=upcoming&region=au&mkt=h2h&dateFormat=iso&apiKey=8be119eaf4bff2c736b06bb9c9051e6e"
//   )
//   .then((response) => {
//     console.log(response.data.data[1].sites);
//     a = response.data.data;
//   })
//   .catch((error) => {
//     console.log(error);
//   });
//https://bottender.js.org/docs/en/the-basics-routing

const ObjectFilter = (obj, predicate) => {
  return Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};

async function CheapShark(id, context, query) {
  const url = "https://www.cheapshark.com/api/1.0/deals";
  if (query != undefined) {
    //url += ;
  }

  axios
    .get(url)
    .then((Response) => {
      console.log(Response.data[0]);
      GameTemplate(Response.data[0], context);
    })
    .catch((error) => {
      console.log(error);
      send(id, "An error occured");
    });
}

async function GameTemplate(data, context) {
  await context.sendGenericTemplate([
    {
      title: `${stores[data.storeID - 1].storeName} SALE: ${data.title}`,
      imageUrl: data.thumb,
      subtitle: `Sale Price: ${
        data.salePrice == 0 ? "FREE!!" : data.salePrice
      } \t Save $${data.normalPrice - data.salePrice}`,
      defaultAction: {
        type: "web_url",
        url: `https://www.metacritic.com/${data.metacriticLink}`,
        messengerExtensions: true,
        webviewHeightRatio: "tall",
        fallbackUrl: `https://www.metacritic.com/${data.metacriticLink}`,
      },
      buttons: [
        {
          type: "postback",
          title: "Start",
          payload: "Start",
        },
      ],
    },
  ]);
}

async function SearchResults(sendGenericTemplate, id, query) {
  const url =
    "https://www.googleapis.com/customsearch/v1?key=AIzaSyBgUpzEMd08Ytu_OHgADH0IgD1XPeM7N5M&cx=8936eb77191e57179&q=";

  axios
    .get(url + query)
    .then((Response) => {
      console.log(Response);
      send(sendGenericTemplate, id, GoogleSearchTemplate());
    })
    .catch((error) => {
      console.log(error);
      send(id, "An error occured");
    });
}
