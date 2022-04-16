const apiBaseUri = "https://ezha-by-app.herokuapp.com/";

export default class ConfigService {
  static addBaseAddress(endpoint) {
    return apiBaseUri + endpoint;
  }
}
