//goto /constants.js to see how these constants are defined
const {
  CARDS,
  BUTTONS,
  newUserTemplate,
  newConnection,
} = require("./constants");

//users database
var users;
var storage = require("node-persist");
storage.init({ dir: "./data" }).then(() => {
  storage.setItem("users", {}); //reset data
  storage.getItem("users").then((data) => {
    users = data;
    console.log("SERVER STARTING: ");
    //console.log(users);
  });
});

class EventHandler {
  constructor() {
    this.c = require("bottender/dist/getClient.js").default("messenger");
    var EventEmitter = require("eventemitter3");
    this.e = new EventEmitter();
    this.e.on("sendCard", (id, card) => this.sendCard(id, card));
    this.e.on("/start", (id) => this.start(id));
    this.e.on("/start", (id) => this.sub(id));
    this.e.on("/server", (id) => this.server(id));
    this.e.on("/stop", (id) => this.stop(id));
    this.e.on("/exit", async (id) => this.exit(id));
    this.e.on("/more_info", (id) => this.moreInfo(id));
    this.e.on("/new_connection", (id) => this.newConnection(id));
    this.e.on("/searching", (id) => this.searching(id));
    this.e.on("/sendMessage", (id) => this.searching(id));
  }
  emit(action, ...args) {
    this.e.emit(action, ...args);
  }
  async sendCard(id, card) {
    this.SendBotMessageTemplate(id, card);
  }
  newConnection(id) {
    this.sendCard(id, CARDS.NEW_CONNECTION);
    this.sendCard(users[id].idConnected, CARDS.NEW_CONNECTION);
  }
  searching(id) {
    this.sendCard(id, CARDS.SEARCHING);
  }
  async start(id) {
    var res = await startLookingForChat(id);
    if (res == "searching") {
      this.searching(id);
    } else {
      this.newConnection(id);
    }
  }
  sub(id) {
    ToggleSubscription(id);
    //this.sendCard(id, CARDS.DEFAULT);
  }
  server(id) {
    serverDetails();
    this.sendCard(id, CARDS.SERVER);
  }
  stop(id) {
    setStatus(id, "dormant");
    this.sendCard(id, CARDS.DEFAULT);
  }
  exit(id) {
    if (users[id].idConnected != null) {
      var idConnected = users[id].idConnected;
      disconnect(id, users[id].idConnected);
      this.sendCard(id, CARDS.DISCONNECTION);
      this.sendCard(idConnected, CARDS.DISCONNECTION);
    } else this.sendCard(id, CARDS.FAILED_DISCONNECTION);
  }
  moreInfo(id) {
    this.sendCard(id, CARDS.MORE_INFO);
  }
  async sendMessage(id, received) {
    this.c.sendMessage(users[id].idConnected, {
      text: received,
    });
    addPoints(id);
  }
  async SendBotMessageTemplate(id, card) {
    await this.c.sendGenericTemplate(id, [
      {
        title: card.title,
        imageUrl: card.url,
        subtitle: card.subtitle,
        buttons: [
          isConnected(id)
            ? BUTTONS.EXIT
            : users[id].status == "searching"
            ? BUTTONS.STOP_WAITING
            : BUTTONS.START,
          users[id].subscribed ? BUTTONS.UNSUB : BUTTONS.SUB,
          BUTTONS.MORE_INFO,
        ],
      },
    ]);
  }
}

//setup event handler
const eventHandler = new EventHandler();

//TODO: seen, typing interactions between users
//TODO: attachments and images between users
//TODO: Games or Netflix API
//TODO: add game component
// points: 0,
// connections: [],
//TODO: add a way to grade or rate user interactions
//TODO: add previous connections tracking to tell users if they are connected to someone new or old
//TODO: add a

//attempts to borrow from the linear redux flow to help keep track of state changes
module.exports = async function App(context) {
  context.getUserProfile().then((user_fb) => {
    var id = user_fb.id;

    if (isNewUser(id)) addUserToDatabase(id);

    var received = getReceivedText(context.event);
    if (isConnected(id) & !isCommand(received)) {
      eventHandler.emit("sendMessage", id, received);
    }
    //emit action based on received text
    if (isCommand(received)) {
      eventHandler.emit(received, id);
    } else if (!isConnected(id)) {
      //not command
      eventHandler.emit("sendCard", id, CARDS.DEFAULT);
    }

    //backup to ROM
    storage.setItem("users", users);
  });
  console.timeEnd();
};

//////////////////////////////////////////////////////////
//only stores id so users stay anonymous to even this system
function isNewUser(id) {
  return users[id] == undefined;
}

function addUserToDatabase(id) {
  users[id] = { ...newUserTemplate, id };
}

function getReceivedText(event) {
  var received;
  if (event.isText) {
    received = event.text;
  } else if (event.isPayload) {
    received = event._rawEvent.postback.payload;
  } else {
    received = event.message;
  }
  return received;
}

function isCommand(received) {
  try {
    return received[0] == "/";
  } catch (err) {
    return false;
  }
}
function isConnected(id) {
  return users[id].status == "connected";
}

///////////////////////////////////////////////

function ToggleSubscription(id) {
  users[id].subscribed = !users[id].subscribed;
  return "toggle_subscription";
}

function serverDetails() {
  return JSON.stringify(users);
}

function setStatus(id, status) {
  users[id].status = status;
  return users[id].status;
}

async function startLookingForChat(id) {
  var idConnected = null;
  var userIDs = Object.keys(users);
  for (let i = 0; i < userIDs.length; i++) {
    if (users[userIDs[i]].status == "searching") {
      idConnected = userIDs[i];
      continue;
    }
  }
  if (idConnected == null) {
    setStatus(id, "searching");
    return "searching";
  } else if (idConnected != id) {
    connect(id, idConnected);
    return "new_connection";
  } else return "searching";
}

function connect(id, idConnected) {
  users[id].idConnected = idConnected;
  users[idConnected].idConnected = id;
  users[idConnected].connections[id] = { ...newConnection };
  users[id].connections[idConnected] = { ...newConnection };
  setStatus(id, "connected");
  setStatus(idConnected, "connected");
}

function disconnect(id, idConnected) {
  users[id].idConnected = null;
  users[idConnected].idConnected = null;
  setStatus(id, "dormant");
  setStatus(idConnected, "dormant");
}

////////////////////////////////////

function addPoints(id) {
  var idConnected = users[id].idConnected;
  users[id].connections[idConnected].points += 1;
}
