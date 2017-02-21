import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LoginComp} from "./login.comp";
import {LogoutComp} from "./logout.comp";
import {RegisterComp} from "./register.comp";
import {RegisterConfirmationComp} from "./registerconfirmation.comp";
import {EmailConfirmationComp} from "./emailconfirmation.comp";
import {UPLOAD_DIRECTIVES} from "ng2-uploader";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, RouterModule],

    exports: [LoginComp, LogoutComp, RegisterComp, RegisterConfirmationComp, EmailConfirmationComp],

    declarations: [LoginComp, LogoutComp, RegisterComp, RegisterConfirmationComp, EmailConfirmationComp, UPLOAD_DIRECTIVES],

    providers: [],

    bootstrap: []
})

export class AccountModule {}