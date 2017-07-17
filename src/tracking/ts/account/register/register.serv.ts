import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, Response} from "@angular/http";
import {StateServ} from "../../core/state.serv";

@Injectable()
export class RegisterServ {

    constructor(private http: Http,
                private stateServ: StateServ) {
    }

    isUsedUsername(username: string) {
        let url = "http://" + window.location.host + "/userexists/" + username;
        return this.http.get(url);
    }

    save(user: string) {
        let url = "http://" + window.location.host + "/register";
        let body = JSON.stringify(user);
        let headers = new Headers({"Content-Type": "application/json"});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }
}
