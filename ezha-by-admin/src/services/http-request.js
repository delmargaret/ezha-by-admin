import axios from "axios";
import ConfigService from "./config-service";
import Emitter from "./event-emitter";
import { USER_LOGGED_OUT } from "./login-service";

function HandleException(ex) {
  const response = ex.response;

  if (!response) return;
  
  if (response.status === 401 || response.status === 403) {
    Emitter.emit(USER_LOGGED_OUT, {});
  }
  
  if (response.data) {
    console.log(`Exception: ${response.data.Message}`);
  } else {
    console.log(`Status code: ${response.status}`);
  }
}

export default class HttpRequest {
  static makeAuthorizationHeaderValue(token) {
    return `Bearer ${token}`;
  }

  static makeHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = this.makeAuthorizationHeaderValue(token);
    }

    return headers;
  }

  static Get(endpoint) {
    const url = ConfigService.addBaseAddress(endpoint);
    const options = {
      url: url,
      method: "GET",
      type: "json",
      headers: this.makeHeaders(),
    };
    return axios(options).catch((error) => HandleException(error));
  }

  static Post(endpoint, data) {
    const url = ConfigService.addBaseAddress(endpoint);
    const options = {
      url: url,
      method: "POST",
      data: data,
      headers: this.makeHeaders(),
    };
    return axios(options).catch((error) => HandleException(error));
  }

  static Delete(endpoint) {
    const url = ConfigService.addBaseAddress(endpoint);
    const options = {
      url: url,
      method: "DELETE",
      headers: this.makeHeaders(),
    };

    return axios(options).catch((error) => HandleException(error));
  }

  static Put(endpoint, data) {
    const url = ConfigService.addBaseAddress(endpoint);
    const options = {
      url: url,
      method: "PUT",
      data: data,
      headers: this.makeHeaders(),
    };

    return axios(options).catch((error) => HandleException(error));
  }
}
