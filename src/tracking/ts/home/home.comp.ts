import * as _ from "lodash";
import * as moment from "moment";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Component, ViewEncapsulation, OnInit, OnDestroy, Inject} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {Response} from "@angular/http";
import {Cfg} from "../core/config";
import {StateServ, Cred} from "../core/state.serv";
import {SmtpServ} from "../core/smtp.serv";
import {HomeServ} from "./home.serv";

@Component({
    selector: "home",
    templateUrl: "/template?type=home",
    styleUrls: ["css/home.css"],
    encapsulation: ViewEncapsulation.None,
    providers: [HomeServ]
})

export class HomeComp implements OnInit {

    private name = "";
    private users = [];
    private tracking = [];
    private filter = "";
    private tracking_filtered = [];
    private roles = ["user", "manager", "admin"];
    private user = "";
    private date = "";
    private time = "";
    private description = "";
    private amount = 0;
    private comment = "";
    private week = 1;
    private year = 2017;
    private new_expense = {id: 0, username: "" , date: "", time: "", description: "", amount: "", comment: ""};
    private report_dsbl = false;

    constructor(private state: StateServ,
                private homeServ: HomeServ,
                private router: Router,
                private smtp: SmtpServ) {
    }

    logout() {
        this.router.navigate(["/logout"]);
    }

    // #### USERS
    isAdmin() {
        return (this.state.cred.role === "admin");
    }

    noViewer(user) {
        return !(this.state.cred.role === "admin" || user.username === this.state.cred.username);
    }

    isManager() {
        return (this.state.cred.role === "admin" || this.state.cred.role === "manager");
    }

    roleChange(user, role) {
        if (this.isManager()) {
            const obj = {username: user.username, role: role};
            this.homeServ.userRole(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    deleteUser(user) {
        if (this.isAdmin() && confirm("Confirm deletion!")) {
            const obj = {username: user.username};
            this.homeServ.userDelete(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                    let idx = this.users.findIndex((elem) => {
                        return elem.username === user.username;
                    });
                    this.users.splice(idx, 1);
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    usersGet() {
        if (this.isManager()) {
            const obj = {};
            this.homeServ.usersGet(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                    this.users = body.res;
                    this.selectUser({username: this.state.cred.username});
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }
    // #### tracking
    addExpense() {
        const new_expense = {
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
    }

    dateChange(event) {
        console.log(event);
    }

    selectUser(user) {
        const obj = user;
        console.log(obj);
        this.user = user.username;
        if (this.isAdmin() || this.user === this.state.cred.username ) {
            this.homeServ.selectUser(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                    this.tracking = body.res.map((elem) => {
                        let date = moment(elem.date).format("YYYY-MM-DD");
                        elem.date = date;
                        let time = moment(elem.time).format("HH:mm");
                        elem.time = time;
                        return elem;
                    });
                    this.tracking_filtered = this.tracking;
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    saveExpense(expense) {
        console.log(expense);
        let obj = {expense: expense};
        this.homeServ.saveExpense(obj).subscribe(
            (res: Response) => {
                const body = res.json();
                console.log(body.res);
                // this.tracking = body.res;
            },

            (err: Response) => {
                console.error(err);
            }
        );
    }

    delExpense(expense) {
        let obj = {expense: expense};
        if (this.isAdmin() && confirm("Confirm deletion")) {
            this.homeServ.delExpense(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                    let idx = this.tracking.indexOf(expense);
                    this.tracking.splice(idx, 1);
                    this.filtertracking(this.filter);
                    // this.tracking = body.res;
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    filtertracking(filter) {
        let tracking = this.tracking;
        if (filter !== "") {
            tracking = this.tracking.filter((elem) => {
                return ((elem.description || "") + (elem.comment || "")).toUpperCase().indexOf(filter.toUpperCase()) > -1;
            });
        }
        this.tracking_filtered = tracking;
    }

    reporttracking() {
        let obj = {
                username: this.user,
                week: + this.week,
                year: + this.year,
                out: "resources/public/tracking-report.pdf"
        };
        this.homeServ.reporttracking(obj).subscribe(
            (res: Response) => {
                console.log(res);
                if (res) {
                    this.report_dsbl = false;
                    let a = document.getElementById("downloadlink");
                    a.click();
                }
            },
            (err: Response) => {
                console.log(err);
            }
        );
    }

    // #### EVENTS
    ngOnInit() {
        this.user = this.state.cred.username;
        this.usersGet();
    }
}
