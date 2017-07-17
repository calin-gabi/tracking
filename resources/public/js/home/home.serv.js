"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var state_serv_1 = require("../core/state.serv");
var HomeServ = (function () {
    function HomeServ(http, stateServ) {
        this.http = http;
        this.stateServ = stateServ;
    }
    HomeServ.prototype.usersGet = function (obj) {
        var url = "/users";
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json", "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.get(url, opts);
    };
    HomeServ.prototype.userDelete = function (obj) {
        var url = "/users/delete?username=" + obj.username;
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.delete(url, opts);
    };
    HomeServ.prototype.userRole = function (obj) {
        var url = "/users/role";
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.post(url, body, opts);
    };
    HomeServ.prototype.selectUser = function (user) {
        var url = "/tracking?username=" + user.username;
        var body = JSON.stringify(user);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.get(url, opts);
    };
    HomeServ.prototype.saveTrack = function (obj) {
        var url = "/tracking/save";
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.post(url, body, opts);
    };
    HomeServ.prototype.delTrack = function (obj) {
        var url = "/tracking/del?id=" + obj.track.id;
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.delete(url, opts);
    };
    HomeServ.prototype.reportTracking = function (obj) {
        var url = "/reports/tracking";
        var body = JSON.stringify(obj);
        var token = this.stateServ.cred.token;
        var headers = new http_1.Headers({ "Content-Type": "application/json",
            "Authorization": "Token " + token });
        var opts = { headers: headers };
        return this.http.post(url, body, opts);
    };
    HomeServ = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, state_serv_1.StateServ])
    ], HomeServ);
    return HomeServ;
}());
exports.HomeServ = HomeServ;
//# sourceMappingURL=home.serv.js.map