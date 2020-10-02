const { google } = require('googleapis');

// Basically access permission for this service.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
    email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    keyId: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
    scopes: SCOPES
});


const api = google.calendar({version : "v3", auth : auth});

export { api };
