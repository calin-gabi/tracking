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
var router_1 = require("@angular/router");
var state_serv_1 = require("../core/state.serv");
var home_serv_1 = require("./home.serv");
var moment = require("moment");
var HomeComp = (function () {
    function HomeComp(router, state, homeServ) {
        this.router = router;
        this.state = state;
        this.homeServ = homeServ;
        this.name = "";
        this.filter = "";
        this.roles = ["user", "manager", "admin"];
        this.user = "";
        this.date = "";
        this.time = "";
        this.start_date = "";
        this.end_date = "";
        this.description = "";
        this.amount = 0;
        this.comment = "";
        this.week = 1;
        this.year = 2017;
        this.new_track = { id: 0, username: "", date: "", time: "", description: "", amount: "", comment: "" };
        this.report_dsbl = false;
    }
    // #### USERS
    HomeComp.prototype.isAdmin = function () {
        return (this.state.cred.role === "admin");
    };
    HomeComp.prototype.noViewer = function (user) {
        return !(this.state.cred.role === "admin" || user.username === this.state.cred.username);
    };
    HomeComp.prototype.isManager = function () {
        return (this.state.cred.role === "admin" || this.state.cred.role === "manager");
    };
    HomeComp.prototype.roleChange = function (user, role) {
        var _this = this;
        if (user.role === "admin" && this.state.cred.role !== "admin") {
            alert("You can not change the role for an admin!");
            user.role = "admin";
            return false;
        }
        if (this.isManager()) {
            if (this.state.cred.username === user.username) {
                if (!confirm("You changed your own credentials. You will be logged out and you will have to login again!")) {
                    return;
                }
            }
            var obj = { username: user.username, role: role };
            this.homeServ.userRole(obj).subscribe(function (res) {
                var body = res.json();
                if (_this.state.cred.username === body.res.username) {
                    window.location.href = "/logout";
                }
                ;
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.deleteUser = function (user) {
        var _this = this;
        if (user.role === "admin" && this.state.cred.role !== "admin") {
            alert("You can not delete an admin!");
            return false;
        }
        if (this.isManager() && confirm("Confirm deletion!")) {
            var obj = { username: user.username };
            this.homeServ.userDelete(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
                var idx = _this.users.findIndex(function (elem) {
                    return elem.username === user.username;
                });
                _this.users.splice(idx, 1);
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.usersGet = function () {
        var _this = this;
        if (this.isManager()) {
            var obj = {};
            this.homeServ.usersGet(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
                _this.users = body.res;
                _this.selectUser(_this.state.cred.username);
            }, function (err) {
                console.error(err);
                window.location.href = "/login";
            });
        }
    };
    // #### tracking
    HomeComp.prototype.addTrack = function () {
        var new_track = {
            id: 0,
            username: this.user,
            date: moment().format("YYYY-MM-DD"),
            time: "01:00",
            description: "",
            amount: 1,
            comment: ""
        };
        console.log(new_track);
        this.tracking.push(new_track);
        this.filterTracking(this.filter);
        this.saveTrack(new_track);
    };
    HomeComp.prototype.dateChange = function (event) {
        console.log(event);
    };
    HomeComp.prototype.weekChange = function (event) {
        console.log(event);
        this.week = event;
    };
    HomeComp.prototype.avgSpeed = function (amount, time) {
        var hours = Math.floor(time.split(":")[0]) + Math.floor(time.split(":")[1]) / 60;
        return (Math.floor(amount) / hours).toFixed(2);
    };
    HomeComp.prototype.selectUser = function (user) {
        var _this = this;
        if (this.isAdmin() || this.user === this.state.cred.username) {
            var obj = { username: user };
            console.log(obj);
            this.homeServ.selectUser(obj).subscribe(function (res) {
                var body = res.json();
                // console.log(body.res);
                _this.tracking = body.res.map(function (elem) {
                    var date = moment(elem.date).format("YYYY-MM-DD");
                    elem.date = date;
                    elem.date_moment = moment.utc(elem.date);
                    // elem._time = elem.time;
                    // let time = moment(elem.time).format("HH:mm");
                    // elem.time_moment = moment.utc(elem.time).valueOf();
                    elem.time = elem._time;
                    return elem;
                });
                _this.tracking_filtered = _this.tracking;
                console.log(_this.tracking);
                _this.user = user;
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.saveTrack = function (track) {
        var _this = this;
        console.log(track);
        var obj = { username: track.username, track: track };
        var idx = this.tracking.indexOf(track);
        this.homeServ.saveTrack(obj).subscribe(function (res) {
            var body = res.json();
            console.log(body.res);
            var saved_track = body.res;
            var date = moment(saved_track.date).format("YYYY-MM-DD");
            saved_track.date = date;
            var time = moment(saved_track.time).format("HH:mm");
            saved_track.time = saved_track._time;
            _this.tracking.splice(idx, 1, body.res);
            // this.tracking = body.res;
        }, function (err) {
            console.error(err);
        });
    };
    HomeComp.prototype.delTrack = function (track) {
        var _this = this;
        var obj = { track: track };
        console.log(obj);
        var cond = (this.isAdmin() || track.username === this.state.cred.username);
        if (cond && confirm("Confirm deletion")) {
            this.homeServ.delTrack(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
                var idx = _this.tracking.indexOf(track);
                _this.tracking.splice(idx, 1);
                _this.filterTracking(_this.filter);
                // this.tracking = body.res;
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.filterTracking = function (filter) {
        var tracking = this.tracking;
        var start_date = new Date(this.start_date);
        var end_date = new Date(this.end_date);
        if (filter !== "") {
            tracking = this.tracking.filter(function (elem) {
                var date_ = new Date(elem.date);
                return (date_ >= start_date && date_ <= end_date);
            });
        }
        this.tracking_filtered = tracking;
    };
    HomeComp.prototype.reportTracking = function () {
        var _this = this;
        var obj = {
            username: this.user,
            week: this.week,
            out: "resources/public/tracking-report.pdf"
        };
        console.log(obj);
        this.homeServ.reportTracking(obj).subscribe(function (res) {
            console.log(res);
            if (res) {
                _this.report_dsbl = false;
                var a = document.getElementById("downloadlink");
                a.click();
            }
        }, function (err) {
            console.log(err);
        });
    };
    // #### EVENTS
    HomeComp.prototype.ngOnInit = function () {
        this.user = this.state.cred.username;
        // console.log(this.state.cred);
        this.usersGet();
        this.selectUser(this.user);
    };
    HomeComp = __decorate([
        core_1.Component({
            selector: "home",
            templateUrl: "views/home.html",
            styleUrls: ["css/home.css"],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [state_serv_1.StateServ, home_serv_1.HomeServ]
        }), 
        __metadata('design:paramtypes', [router_1.Router, state_serv_1.StateServ, home_serv_1.HomeServ])
    ], HomeComp);
    return HomeComp;
}());
exports.HomeComp = HomeComp;
//# sourceMappingURL=home.comp.js.map