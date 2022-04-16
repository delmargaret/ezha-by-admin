const apiBaseUri = 'https://localhost:44327/';

export default class ConfigService {
    static addBaseAddress(endpoint) {
        return apiBaseUri + endpoint;
    }
}
