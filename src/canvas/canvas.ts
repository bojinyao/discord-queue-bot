import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { strict } from 'assert';
import { union } from 'lodash';

/**
 * Canvas LMS has pagination. Maximum number of items
 * returned by a page is about 100: 
 * https://canvas.instructure.com/doc/api/file.pagination.html
 * 
 * This is done to reduce the number of requests since class 
 * sizes tend to be big, and Canvas LMS API throttles at like 700 
 * request credits:
 * https://canvas.instructure.com/doc/api/file.throttling.html
 * 100 seems to be more cost effective...
 */
let PAGE_SIZE = 10;

/** 
 * Time out after some time since page size is rather large that's 
 * previously defined.
 */
let TIMEOUT = 5000;


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
        // to get around tsc check
        this.accessToken = accessToken || '';
        strict(this.accessToken != '', 'Missing Canvas access token');
        this.apiVersion = apiVersion;
        this.instance = axios.create({
            baseURL: `${this.host}/api/${this.apiVersion}`,
            // Axios' auth does not support Bearer
            headers: { 'Authorization': `Bearer ${this.accessToken}` },
            timeout: TIMEOUT,
            params: {
                per_page: PAGE_SIZE // set number of items per page
            }
        });
    }

    /**
     * Send GET request
     * @param endpointRelativeUrl relative Url of endpoint
     * @param requestConfig AxiosRequestConfig object
     * @returns Promise<any[]> of request result
     */
    async get(endpointRelativeUrl: string, requestConfig?: AxiosRequestConfig): Promise<any[]> {
        // endpoint must be relative url
        strict(!endpointRelativeUrl.startsWith('/'), `[GET]: ${endpointRelativeUrl} cannot start with '/'`);
        try {
            let res = await this.instance.get(endpointRelativeUrl, requestConfig);
            let body = res.data;
            /*
            Here we need to handle pagination when executing a GET request
            https://canvas.instructure.com/doc/api/file.pagination.html
            */
            let checkNext = true;
            while (checkNext) {
                checkNext = false;
                if ('link' in res.headers) { // TODO: use parse link header to handle parsing: https://www.npmjs.com/package/parse-link-header
                    let links: string = res.headers['link'];
                    let linksArr = links.split(',');
                    for (let l of linksArr) {
                        if (l.lastIndexOf('next') != -1) {
                            let start = l.indexOf('<') + 1;
                            let end = l.lastIndexOf('>');
                            // No need to pass in config again here because link contains
                            // everything the request needs.
                            res = await this.instance.get(l.slice(start, end));
                            body = union(body, res.data);
                            checkNext = true;
                            break;
                        }
                    }
                }
            }
            return body;
        } catch (error) {
            throw error;
        }
    }
}
