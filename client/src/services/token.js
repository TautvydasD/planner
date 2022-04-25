class Token {
  static getLocalRefreshToken() {
    return JSON.parse(localStorage.getItem('user'))?.refreshToken;
  }

  static getLocalAccessToken() {
    return JSON.parse(localStorage.getItem('user'))?.accessToken;
  }

  static updateLocalAccessToken(token) {
    const user = JSON.parse(localStorage.getItem('user'));
    user.accessToken = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem('user');
  }
}

export default new Token();
