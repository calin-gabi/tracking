import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, Response} from "@angular/http";
import {StateServ} from "../../core/state.serv";

@Injectable()
export class LoginServ {

    constructor(private http: Http,
                private stateServ: StateServ) {
    }

    login(user: any) {
        let url = "http://" + window.location.host + "/login";
        let body = JSON.stringify(user);
        let headers = new Headers({"Content-Type": "application/json", "Authorization" : "Basic " + btoa(user.username + ":" + user.password)});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }
}
