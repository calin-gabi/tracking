import {Injectable} from "@angular/core";
import {Http, Headers, Request, RequestOptions, RequestMethod, Response} from "@angular/http";
import {Cfg} from "../core/config";
import {StateServ} from "../core/state.serv";

@Injectable()
export class HomeServ {

    constructor(private http: Http,
                private cfg: Cfg,
                private stateServ: StateServ) {
    }

    usersGet(obj) {
        let url = "/users";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json", "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    userDelete(obj) {
        let url = "/users/delete";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    userRole(obj) {
        let url = "/users/role";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    selectUser(user) {
        let url = "/tracking";
        let body = JSON.stringify(user);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    saveExpense(obj) {
        let url = "/tracking/save";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    delExpense(obj) {
        let url = "/tracking/del";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }

    reporttracking(obj) {
        let url = "/reports/tracking";
        let body = JSON.stringify(obj);
        const token = this.stateServ.cred.token;
        let headers = new Headers({"Content-Type": "application/json",
                                   "Authorization": "Token " +  token});
        let opts = {headers: headers};
        return this.http.post(url, body, opts);
    }
}
