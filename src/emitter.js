
class EventHandler {
  constructor() {
    var EventEmitter = require("eventemitter3");
    this.e = new EventEmitter();
    this.e.on("sendCard", (id, card) => this.sendCard(id, card));
    this.e.on(COMMANDS.START, (id) => this.start(id));
    this.e.on(COMMANDS.SUB, (id) => this.sub(id));
    this.e.on(COMMANDS.SERVER, (id) => this.server(id));
    this.e.on(COMMANDS.STOP, (id) => this.stop(id));
    this.e.on(COMMANDS.EXIT, async (id) => this.exit(id));
    this.e.on(COMMANDS.MORE_INFO, (id) => this.moreInfo(id));
    this.e.on(RESPONSES.NEW_CONNECTION, (id) => this.newConnection(id));
    this.e.on(RESPONSES.SEARCHING, (id) => this.searching(id));
  }
  emit(action, ...args) {
    this.e.emit(action, ...args);
  }
  sendCard(id, card) {
    console.log(id, card);
    sendBotMessageTemplate(id, card);
  }
  newConnection(id) {
    this.sendCard(id, CARDS.NEW_CONNECTION);
    this.sendCard(users[id].idConnected, CARDS.NEW_CONNECTION);
  }
  searching(id) {
    this.sendCard(id, CARDS.SEARCHING);
  }
  start(id) {
    var res = startLookingForChat(id);
    if (res == RESPONSES.SEARCHING) {
      this.searching(id);
    } else {
      this.newConnection(id);
    }
  }
  sub(id) {
    ToggleSubscription(id);
    this.sendCard(id, CARDS);
  }
  server(id) {
    serverDetails();
    this.sendCard(id, CARDS.SERVER);
  }
  stop(id) {
    setStatus(id, RESPONSES.DORMANT);
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
  sendBotMessageTemplate(id, card) {
    await c.sendGenericTemplate(id, [
      {
        title: card.title,
        imageUrl: card.url,
        subtitle: card.subtitle,
        buttons: [
          isConnected(id)
            ? BUTTONS.EXIT
            : users[id].status == RESPONSES.SEARCHING
            ? BUTTONS.STOP_WAITING
            : BUTTONS.START,
          users[id].subscribed ? BUTTONS.UNSUB : BUTTONS.SUB,
          BUTTONS.MORE_INFO,
        ],
      },
    ]);
  }
}