class AppUser {
  constructor(id, userName, enabled, role) {
    this.id = id;
    this.userName = userName;
    this.enabled = enabled;
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  getId() {
    return this.id;
  }

  getUserName() {
    return this.userName;
  }

  getEnabled() {
    return this.role;
  }

  setRole(role) {
    this.role = role;
  }

  setId(id) {
    this.id = id;
  }

  setUserName(userName) {
    this.userName = userName;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

module.exports = AppUser;
