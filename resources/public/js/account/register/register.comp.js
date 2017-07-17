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
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var state_serv_1 = require("../../core/state.serv");
var register_serv_1 = require("./register.serv");
var RegisterComp = (function () {
    function RegisterComp(router, fb, stateServ, registerServ) {
        this.router = router;
        this.fb = fb;
        this.stateServ = stateServ;
        this.registerServ = registerServ;
        this.submitted = false;
        this.errMsg = "";
        this.showErrMsg = false;
        this.onCred = new ReplaySubject_1.ReplaySubject();
    }
    RegisterComp.prototype.areNotEqual = function (control) {
        var controls = control["controls"];
        var password = controls["password"];
        var password_rep = controls["password_rep"];
        var ok = !password_rep.touched || (password.value === password_rep.value);
        return ok ? null : { areNotEqual: true };
    };
    RegisterComp.prototype.validateEmail = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return true; // re.test(email) || (email === "");
    };
    RegisterComp.prototype.usedUsername = function (control) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            if (!control.value) {
                resolve(null);
                return;
            }
            // if (!this.validateEmail(control.value)) {
            //     resolve({ notEmail: true });
            //     // console.log(control);
            //     return
            // }
            _this.registerServ.isUsedUsername(control.value).subscribe(function (res) {
                var body = res.json();
                var stat = body.stat;
                if (body.res) {
                    resolve({ usedUsername: true });
                }
                else {
                    resolve(null);
                }
            }, function (err) {
                console.error(err);
            });
        });
        return p;
    };
    RegisterComp.prototype.buildForm = function () {
        this.form = this.fb.group({
            first_name: ["", [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(100),
                ]],
            last_name: ["", [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(100),
                ]],
            username: ["", [forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(100),
                ], this.usedUsername.bind(this)],
            iagree: [false, forms_1.Validators.pattern('true')],
            passwords: this.fb.group({
                password: ["", [forms_1.Validators.required,
                        forms_1.Validators.minLength(5)]],
                password_rep: ["", [forms_1.Validators.required,
                        forms_1.Validators.minLength(5)]]
            }, { validator: this.areNotEqual })
        });
        this.first_name = this.form.controls["first_name"];
        this.last_name = this.form.controls["last_name"];
        this.username = this.form.controls["username"];
        this.passwords = this.form.controls["passwords"];
        this.password = this.form.controls["password"];
        this.password_rep = this.form.controls["password_rep"];
    };
    RegisterComp.prototype.submit = function () {
        var _this = this;
        this.submitted = true;
        var obj = this.form.value;
        obj.picture_url = null;
        obj.email = this.username.value;
        console.log(obj);
        this.registerServ.save(obj).subscribe(function (res) {
            console.log(res.json());
            var body = res.json();
            var stat = body.stat;
            if (stat === "ok") {
                console.log(body.res);
                _this.errMsg = "";
                // !!! here also save the id
                var obj_1 = {
                    token: body.res.token,
                    username: body.res.user.username,
                    timestamp: Date.now(),
                    role: body.res.user.role,
                    userprofile: body.res.userprofile
                };
                _this.stateServ.cred = obj_1;
                _this.stateServ.userProfile = body.res.userprofile;
                console.log(_this.stateServ.cred);
                _this.router.navigate(["/"]);
                window.location.href = "/";
            }
        }, function (err) {
            console.error(err);
        });
    };
    // #### EVENTS
    RegisterComp.prototype.ngOnInit = function () {
        this.buildForm();
    };
    RegisterComp.prototype.ngOnDestroy = function () {
    };
    RegisterComp = __decorate([
        core_1.Component({
            selector: "register",
            templateUrl: "views/register.html",
            styleUrls: ["css/account.css"],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [forms_1.FormBuilder, register_serv_1.RegisterServ]
        }), 
        __metadata('design:paramtypes', [router_1.Router, forms_1.FormBuilder, state_serv_1.StateServ, register_serv_1.RegisterServ])
    ], RegisterComp);
    return RegisterComp;
}());
exports.RegisterComp = RegisterComp;
//# sourceMappingURL=register.comp.js.map