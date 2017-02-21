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
var moment = require("moment");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var state_serv_1 = require("../core/state.serv");
var smtp_serv_1 = require("../core/smtp.serv");
var home_serv_1 = require("./home.serv");
var HomeComp = (function () {
    function HomeComp(state, homeServ, router, smtp) {
        this.state = state;
        this.homeServ = homeServ;
        this.router = router;
        this.smtp = smtp;
        this.name = "";
        this.users = [];
        this.tracking = [];
        this.filter = "";
        this.tracking_filtered = [];
        this.roles = ["user", "manager", "admin"];
        this.user = "";
        this.date = "";
        this.time = "";
        this.description = "";
        this.amount = 0;
        this.comment = "";
        this.week = 1;
        this.year = 2017;
        this.new_expense = { id: 0, username: "", date: "", time: "", description: "", amount: "", comment: "" };
        this.report_dsbl = false;
    }
    HomeComp.prototype.logout = function () {
        this.router.navigate(["/logout"]);
    };
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
        if (this.isManager()) {
            var obj = { username: user.username, role: role };
            this.homeServ.userRole(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.deleteUser = function (user) {
        var _this = this;
        if (this.isAdmin() && confirm("Confirm deletion!")) {
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
                _this.selectUser({ username: _this.state.cred.username });
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.addExpense = function () {
        var new_expense = {
            id: 0,
            username: this.user,
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm"),
            description: "",
            amount: 0,
            comment: ""
        };
        console.log(new_expense);
        this.tracking.push(new_expense);
        this.filtertracking(this.filter);
    };
    HomeComp.prototype.dateChange = function (event) {
        console.log(event);
    };
    HomeComp.prototype.selectUser = function (user) {
        var _this = this;
        var obj = user;
        console.log(obj);
        this.user = user.username;
        if (this.isAdmin() || this.user === this.state.cred.username) {
            this.homeServ.selectUser(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
                _this.tracking = body.res.map(function (elem) {
                    var date = moment(elem.date).format("YYYY-MM-DD");
                    elem.date = date;
                    var time = moment(elem.time).format("HH:mm");
                    elem.time = time;
                    return elem;
                });
                _this.tracking_filtered = _this.tracking;
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.saveExpense = function (expense) {
        console.log(expense);
        var obj = { expense: expense };
        this.homeServ.saveExpense(obj).subscribe(function (res) {
            var body = res.json();
            console.log(body.res);
        }, function (err) {
            console.error(err);
        });
    };
    HomeComp.prototype.delExpense = function (expense) {
        var _this = this;
        var obj = { expense: expense };
        if (this.isAdmin() && confirm("Confirm deletion")) {
            this.homeServ.delExpense(obj).subscribe(function (res) {
                var body = res.json();
                console.log(body.res);
                var idx = _this.tracking.indexOf(expense);
                _this.tracking.splice(idx, 1);
                _this.filtertracking(_this.filter);
            }, function (err) {
                console.error(err);
            });
        }
    };
    HomeComp.prototype.filtertracking = function (filter) {
        var tracking = this.tracking;
        if (filter !== "") {
            tracking = this.tracking.filter(function (elem) {
                return ((elem.description || "") + (elem.comment || "")).toUpperCase().indexOf(filter.toUpperCase()) > -1;
            });
        }
        this.tracking_filtered = tracking;
    };
    HomeComp.prototype.reporttracking = function () {
        var _this = this;
        var obj = {
            username: this.user,
            week: +this.week,
            year: +this.year,
            out: "resources/public/tracking-report.pdf"
        };
        this.homeServ.reporttracking(obj).subscribe(function (res) {
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
    HomeComp.prototype.ngOnInit = function () {
        this.user = this.state.cred.username;
        this.usersGet();
    };
    HomeComp = __decorate([
        core_1.Component({
            selector: "home",
            templateUrl: "/template?type=home",
            styleUrls: ["css/home.css"],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [home_serv_1.HomeServ]
        }), 
        __metadata('design:paramtypes', [state_serv_1.StateServ, home_serv_1.HomeServ, router_1.Router, smtp_serv_1.SmtpServ])
    ], HomeComp);
    return HomeComp;
}());
exports.HomeComp = HomeComp;
//# sourceMappingURL=home.comp.js.map