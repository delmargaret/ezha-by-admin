import HttpRequest from "./http-request";

export const USER_LOGGED = "USER_LOGGED";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";

export const CREDENTIALS_NOT_FOUND = "CREDENTIALS_NOT_FOUND";
export const WRONG_ROLE = "WRONG_ROLE";
export const CREDENTIALS_OK = "CREDENTIALS_OK";
export const CREDENTIALS_NOT_CHECKED = "CREDENTIALS_NOT_CHECKED";

export default class LoginService {
  static tokenKey = "token";
  static roleKey = "role";
  static userId = "userId";

  static getUser() {
    const token = localStorage.getItem(this.tokenKey);
    const role = localStorage.getItem(this.roleKey);
    const userId = localStorage.getItem(this.userId);

    return {
      token: token,
      role: role,
      userId: userId,
    };
  }

  static removeUser() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userId);
  }

  static async setUserInRole(email, password, role) {
    const data = {
      email: email,
      password: password,
    };

    const result = await HttpRequest.Post("api/token", data);

    if (!result) return CREDENTIALS_NOT_FOUND;

    if (result.data.role !== role) return WRONG_ROLE;

    localStorage.setItem(this.tokenKey, result.data.token);
    localStorage.setItem(this.roleKey, result.data.role);
    localStorage.setItem(this.userId, result.data.userId);

    return CREDENTIALS_OK;
  }
}
