import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HomeComp} from "./home.comp";

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule],

    exports: [HomeComp],

    declarations: [HomeComp],

    providers: [],

    bootstrap: []
})

export class HomeModule {}
