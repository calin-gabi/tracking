import {Component, ViewEncapsulation, OnInit, OnDestroy, Inject} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {StateServ, Cred} from "../core/state.serv";
import {HomeServ} from "./home.serv";
import {Response} from "@angular/http";
import * as moment from "moment";

@Component({
    selector: "home",
    templateUrl: "views/home.html",
    styleUrls: ["css/home.css"],
    encapsulation: ViewEncapsulation.None,
    providers: [StateServ, HomeServ]
})

export class HomeComp implements OnInit {

    private name = "";
    private users: any[];
    private tracking: any[];
    private filter = "";
    private tracking_filtered: any[];
    private roles = ["user", "manager", "admin"];
    private user = "";
    private date = "";
    private time = "";
    private start_date = "";
    private end_date = "";
    private description = "";
    private amount = 0;
    private comment = "";
    private week = 1;
    private year = 2017;
    private new_track = { id: 0, username: "", date: "", time: "", description: "", amount: "", comment: "" };
    private report_dsbl = false;

    constructor(private router: Router,
        private state: StateServ,
        private homeServ: HomeServ) {
    }
    // #### USERS
    isAdmin() {
        return (this.state.cred.role === "admin");
    }

    noViewer(user: any) {
        return !(this.state.cred.role === "admin" || user.username === this.state.cred.username);
    }

    isManager() {
        return (this.state.cred.role === "admin" || this.state.cred.role === "manager");
    }

    roleChange(user: any, role: string) {
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
            const obj = { username: user.username, role: role };
            this.homeServ.userRole(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    if (this.state.cred.username === body.res.username) {
                        window.location.href = "/logout";
                    };
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    deleteUser(user: any) {
        if (user.role === "admin" && this.state.cred.role !== "admin") {
            alert("You can not delete an admin!");
            return false;
        }
        if (this.isManager() && confirm("Confirm deletion!")) {
            const obj = { username: user.username };
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
                    this.selectUser(this.state.cred.username);
                },

                (err: Response) => {
                    console.error(err);
                    window.location.href = "/login";
                }
            );
        }
    }
    // #### tracking
    addTrack() {
        const new_track = {
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
    }

    dateChange(event: any) {
        console.log(event);
    }

    weekChange(event: any) {
        console.log(event);
        this.week = event;
    }

    avgSpeed(amount: any, time: any) {
        let hours = Math.floor(time.split(":")[0]) + Math.floor(time.split(":")[1]) / 60;
        return (Math.floor(amount) / hours).toFixed(2);
    }

    selectUser(user: any) {
        if (this.isAdmin() || this.user === this.state.cred.username) {
            const obj = { username: user };
            console.log(obj);
            this.homeServ.selectUser(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    // console.log(body.res);
                    this.tracking = body.res.map((elem: any) => {
                        let date = moment(elem.date).format("YYYY-MM-DD");
                        elem.date = date;
                        elem.date_moment = moment.utc(elem.date);
                        // elem._time = elem.time;
                        // let time = moment(elem.time).format("HH:mm");
                        // elem.time_moment = moment.utc(elem.time).valueOf();
                        elem.time = elem._time;
                        return elem;
                    });
                    this.tracking_filtered = this.tracking;
                    console.log(this.tracking);
                    this.user = user;
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    saveTrack(track: any) {
        console.log(track);
        let obj = { username: track.username, track: track };
        let idx = this.tracking.indexOf(track);
        this.homeServ.saveTrack(obj).subscribe(
            (res: Response) => {
                const body = res.json();
                console.log(body.res);
                let saved_track = body.res;
                let date = moment(saved_track.date).format("YYYY-MM-DD");
                saved_track.date = date;
                let time = moment(saved_track.time).format("HH:mm");
                saved_track.time = saved_track._time;
                this.tracking.splice(idx, 1, body.res);
                // this.tracking = body.res;
            },

            (err: Response) => {
                console.error(err);
            }
        );
    }

    delTrack(track: any) {
        let obj = { track: track };
        console.log(obj);
        let cond = (this.isAdmin() || track.username === this.state.cred.username);
        if (cond && confirm("Confirm deletion")) {
            this.homeServ.delTrack(obj).subscribe(
                (res: Response) => {
                    const body = res.json();
                    console.log(body.res);
                    let idx = this.tracking.indexOf(track);
                    this.tracking.splice(idx, 1);
                    this.filterTracking(this.filter);
                    // this.tracking = body.res;
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        }
    }

    filterTracking(filter: any) {
        let tracking = this.tracking;
        let start_date = new Date(this.start_date);
        let end_date = new Date(this.end_date);
        if (filter !== "") {
            tracking = this.tracking.filter((elem) => {
                let date_ = new Date(elem.date);
                return (date_ >= start_date && date_ <= end_date);
            });
        }
        this.tracking_filtered = tracking;
    }

    reportTracking() {
        let obj = {
            username: this.user,
            week: this.week,
            out: "resources/public/tracking-report.pdf"
        };
        console.log(obj);
        this.homeServ.reportTracking(obj).subscribe(
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
        // console.log(this.state.cred);
        this.usersGet();
        this.selectUser(this.user);
    }
}
