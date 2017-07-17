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
var state_serv_1 = require("../../core/state.serv");
var LoginServ = (function () {
    function LoginServ(http, stateServ) {
        this.http = http;
        this.stateServ = stateServ;
    }
    LoginServ.prototype.login = function (user) {
        var url = "http://" + window.location.host + "/login";
        var body = JSON.stringify(user);
        var headers = new http_1.Headers({ "Content-Type": "application/json", "Authorization": "Basic " + btoa(user.username + ":" + user.password) });
        var opts = { headers: headers };
        return this.http.post(url, body, opts);
    };
    LoginServ = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, state_serv_1.StateServ])
    ], LoginServ);
    return LoginServ;
}());
exports.LoginServ = LoginServ;
//# sourceMappingURL=login.serv.js.map