import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, Response} from "@angular/http";

@Injectable()
export class LogoutServ {

    constructor(private http: Http) {
    }

    logout(user: any) {
        let url = "http://" + window.location.host + "/logout";
        let body = JSON.stringify(user);
        let headers = new Headers({"Content-Type": "application/json"});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }
}
