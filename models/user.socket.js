class SocketUser {
  constructor({ socketId, userId, name, username, token }) {
    this.socketId = socketId;
    this.userId = userId;
    this.name = name;
    this.username = username;
    this.token = token;
  }
}

module.exports = SocketUser;
