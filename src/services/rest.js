import { ajax } from 'jquery'

var errorHandled = request => request
    .fail(msg => { throw new Error(msg && (msg.status == 0 ? 'Unable to communicate with server.' : msg.statusText) || msg); });

export var Rest = {
    get: url => errorHandled(ajax({ url, cache: false, type: "GET" })),
    post: ({ url, data }) => errorHandled(ajax({
        url,
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json"
    }))
}