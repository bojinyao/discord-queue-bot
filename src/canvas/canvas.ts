import axios, { AxiosInstance } from 'axios';
import { strict } from 'assert';
// import { unionWith, isEqual } from 'lodash';

/* Canvas LMS has pagination. Maximum number of items
 * returned by a page is about 100: 
 * https://canvas.instructure.com/doc/api/file.pagination.html
 * 
 * This is done to reduce the number of requests since class 
 * sizes tend to be big, and Canvas LMS API throttles at like 700 
 * request credits:
 * https://canvas.instructure.com/doc/api/file.throttling.html
 * 100 seems to be more cost effective...
 */
let PAGE_SIZE = 100;

/* Time out after some time since page size is rather large that's 
 * previously defined.
 */
let TIMEOUT = 2000;


/**
 * Canvas object to handle Canvas LMS API requests.
 */
export default class Canvas {

    private host: string;
    private accessToken: string;
    private apiVersion: string;
    private instance: AxiosInstance;

    constructor(host: string, accessToken: string | undefined, apiVersion = 'v1') {
        this.host = host;
        this.accessToken = accessToken || ''; // to get around ts compiler check
        strict(this.accessToken != '', 'Missing Canvas access token');
        this.apiVersion = apiVersion;
        this.instance = axios.create({
            baseURL: `${this.host}/api/${this.apiVersion}`,
            headers: { 'Authorization': `Bearer ${this.accessToken}` }, // cannot use auth in axios
            timeout: TIMEOUT,
            params: {
                per_page: PAGE_SIZE // set number of items per page
            }
        })
    }

    /**
     * Send GET request
     * @param endpointRelativeUrl relative Url of endpoint
     */
    async get(endpointRelativeUrl: string) {
        // endpoint must be relative url
        strict(!endpointRelativeUrl.startsWith('/'), `In GET: ${endpointRelativeUrl} starts with '/'`);
        try {
            let res = await this.instance.get(endpointRelativeUrl);
            console.log(res.data);
            console.log("-------------")
            console.log(res.headers);
        } catch (error) {
            console.log(error);
        }
    }
}
