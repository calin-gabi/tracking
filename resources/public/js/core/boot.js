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
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var home_module_1 = require("../home/home.module");
var account_module_1 = require("../account/account.module");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// import {CoreModule} from "./core.module";
var routing_comp_1 = require("./routing.comp");
var core_module_1 = require("./core.module");
// import {Cfg} from "./config";
var MainComp = (function () {
    function MainComp() {
        this.trackingng = "";
    }
    MainComp.prototype.ngOnInit = function () {
    };
    MainComp = __decorate([
        core_1.Component({
            selector: "main",
            templateUrl: "views/main.html",
            styleUrls: [],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: []
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MainComp);
    return MainComp;
}());
exports.MainComp = MainComp;
var MainModule = (function () {
    function MainModule() {
    }
    MainModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, routing_comp_1.routing,
                home_module_1.HomeModule, account_module_1.AccountModule, core_module_1.CoreModule],
            exports: [],
            declarations: [MainComp],
            providers: [],
            bootstrap: [MainComp]
        }), 
        __metadata('design:paramtypes', [])
    ], MainModule);
    return MainModule;
}());
exports.MainModule = MainModule;
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(MainModule);
//# sourceMappingURL=boot.js.map