import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LoginComp} from "./login/login.comp";
import {LogoutComp} from "./logout/logout.comp";
import {RegisterComp} from "./register/register.comp";
import {RegisterConfirmationComp} from "./registerConfirmation/registerconfirmation.comp";
import {EmailConfirmationComp} from "./emailConfirmation/emailconfirmation.comp";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, RouterModule],

    exports: [LoginComp, LogoutComp, RegisterComp, RegisterConfirmationComp, EmailConfirmationComp],

    declarations: [LoginComp, LogoutComp, RegisterComp, RegisterConfirmationComp, EmailConfirmationComp],

    providers: [],

    bootstrap: []
})

export class AccountModule {}
