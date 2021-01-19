import axios from 'axios';
import { unionWith, isEqual } from 'lodash';

/* Canvas LMS has pagination. Maximum number of items
 * returned by a page is about 100.
 */
let PAGE_SIZE = 100;

export class Canvas {

    private host: string;
    private accessToken: string;
    private apiVersion: string;
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
