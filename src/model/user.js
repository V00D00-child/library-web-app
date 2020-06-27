class Appuser {
  constructor(id, username, password, enable, salt) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.enable = enable;
    this.salt = salt;
  }
}

module.exports = Appuser;
