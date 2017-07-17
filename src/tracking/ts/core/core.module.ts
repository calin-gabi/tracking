import {BrowserModule} from "@angular/platform-browser";
import {NgModule}  from "@angular/core";
import {AuthServ} from "./auth.serv";
import {StateServ} from "./state.serv";
import {LocalStorageComp} from "./storage.comp"

@NgModule({
    imports: [BrowserModule],

    exports: [],

    declarations: [],

    providers: [AuthServ, StateServ, LocalStorageComp],

    bootstrap: []
})

export class CoreModule {}
