import {ReplaySubject} from "rxjs/ReplaySubject";
import {Component, ViewEncapsulation, OnInit, OnDestroy, Inject} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {Response} from "@angular/http";
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {StateServ, Cred} from "../../core/state.serv";
import {RegisterServ} from "./register.serv";

@Component({
    selector: "register",
    templateUrl: "views/register.html", //"/template?type=register",
    styleUrls: ["css/account.css"],
    encapsulation: ViewEncapsulation.None,
    providers: [FormBuilder, RegisterServ]
})

export class RegisterComp implements OnInit, OnDestroy {

    private form: FormGroup;
    private first_name: AbstractControl;
    private last_name: AbstractControl;
    private username: AbstractControl;
    private passwords: AbstractControl;
    private password: AbstractControl;
    private password_rep: AbstractControl;


    private submitted: boolean = false;

    public errMsg: string = "";

    private showErrMsg = false;

    public onCred: ReplaySubject<any> = new ReplaySubject();


    constructor(private router: Router,
        private fb: FormBuilder,
        private stateServ: StateServ,
        private registerServ: RegisterServ) {
    }

    areNotEqual(control: FormControl): { [s: string]: boolean } {
        const controls = control["controls"];
        const password = controls["password"];
        const password_rep = controls["password_rep"];
        const ok = !password_rep.touched || (password.value === password_rep.value);
        return ok ? null : { areNotEqual: true };
    }

    validateEmail(email: string) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return true; // re.test(email) || (email === "");
    }

    usedUsername(control: FormControl): Promise<any> {
        let p = new Promise((resolve, reject) => {
            if (!control.value) {
                resolve(null);
                return;
            }

            // if (!this.validateEmail(control.value)) {
            //     resolve({ notEmail: true });
            //     // console.log(control);
            //     return
            // }

            this.registerServ.isUsedUsername(control.value).subscribe(
                (res: Response) => {
                    const body = res.json();
                    const stat = body.stat;
                    if (body.res) {
                        resolve({ usedUsername: true });
                    } else {
                        resolve(null);
                    }
                },

                (err: Response) => {
                    console.error(err);
                }
            );
        });
        return p;
    }

    buildForm(): void {
        this.form = this.fb.group({
            first_name: ["", [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            last_name: ["", [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            username: ["", [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ], this.usedUsername.bind(this)],
            iagree: [false, Validators.pattern('true')],
            passwords: this.fb.group({
                password: ["", [Validators.required,
                    Validators.minLength(5)]],
                password_rep: ["", [Validators.required,
                    Validators.minLength(5)]]
            }, { validator: this.areNotEqual })
        });
        this.first_name = this.form.controls["first_name"];
        this.last_name = this.form.controls["last_name"];
        this.username = this.form.controls["username"];
        this.passwords = this.form.controls["passwords"];
        this.password = this.form.controls["password"];
        this.password_rep = this.form.controls["password_rep"];
    }

    submit(): void {
        this.submitted = true;
        let obj = this.form.value;
        obj.picture_url = null;
        obj.email = this.username.value;
        console.log(obj);
        this.registerServ.save(obj).subscribe(
            (res: Response) => {
                console.log(res.json());
                const body = res.json();
                const stat = body.stat;
                if (stat === "ok") {
                    console.log(body.res);
                    this.errMsg = "";
                    // !!! here also save the id
                    const obj = {
                        token: body.res.token,
                        username: body.res.user.username,
                        timestamp: Date.now(),
                        role: body.res.user.role,
                        userprofile: body.res.userprofile
                    };
                    this.stateServ.cred = obj;
                    this.stateServ.userProfile = body.res.userprofile;
                    console.log(this.stateServ.cred);
                    this.router.navigate(["/"]);
                    window.location.href = "/";
                }
            },

            (err: Response) => {
                console.error(err);
            }
        );
    }

    // #### EVENTS
    ngOnInit() {
        this.buildForm();
    }

    ngOnDestroy() {
    }
}
