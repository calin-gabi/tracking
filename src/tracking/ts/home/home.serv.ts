import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, Response} from "@angular/http";
import {StateServ} from "../core/state.serv";

@Injectable()
export class HomeServ {

    constructor(private http: Http,
                private stateServ: StateServ) {
    }

    usersGet(obj: any) {
        let url = "/users";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json", "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.get(url, opts);
    }

    userDelete(obj: any) {
        let url = "/users/delete?username=" + obj.username;
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.delete(url, opts);
    }

    userRole(obj: any) {
        let url = "/users/role";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    selectUser(user: any) {
        let url = "/tracking?username=" + user.username;
        let body = JSON.stringify(user);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.get(url, opts);
    }

    saveTrack(obj: any) {
        let url = "/tracking/save";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    delTrack(obj: any) {
        let url = "/tracking/del?id=" + obj.track.id;
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.delete(url, opts);
    }

    reportTracking(obj: any) {
        let url = "/reports/tracking";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }
}
