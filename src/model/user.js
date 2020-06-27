class Appuser {
  constructor(id, username, password, enable, salt, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.enable = enable;
    this.salt = salt;
    this.role = role;
  }
}

module.exports = Appuser;
