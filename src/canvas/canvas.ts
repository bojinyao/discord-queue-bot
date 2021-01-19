import { request } from 'https';
import { unionWith, isEqual } from 'lodash';

export class Canvas {

    host: string;
    accessToken: string;
    apiVersion: string;
    private hostUrl: string;

    constructor(host: string, accessToken: string, apiVersion = 'v1') {
        this.host = host;
        this.accessToken = accessToken;
        this.apiVersion = apiVersion;
        this.hostUrl = `${this.host}/api/${this.apiVersion}`;
    }

    private buildUrl(endpoint: string) {
        return this.hostUrl + (endpoint[0] === '/' ? '' : '/') + endpoint
    }
}
