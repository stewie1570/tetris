import { ajax } from 'jquery'

export var Rest = {
    get: url => ajax({ url, cache: false, type: "GET" })
}