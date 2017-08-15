var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { SelectOption } from "./selectoption";
import { Md5 } from 'ts-md5/dist/md5';
var keygeneratorComponent = (function () {
    function keygeneratorComponent(_formBuilder) {
        this._formBuilder = _formBuilder;
        this.applicationList = [];
    }
    keygeneratorComponent.prototype.ngOnInit = function () {
        this.applicationList = [
            new SelectOption("Tradepks", "Tradepks")
        ];
        this.keyGen = this._formBuilder.group({
            validity: [null, Validators.required],
            application_name: [null, Validators.required]
        });
    };
    keygeneratorComponent.prototype.keyGenSubmit = function () {
        var formValue = this.keyGen.value;
        this.applicationName = formValue.application_name;
        this.validityDate = formValue.validity;
        this.randomValue = Math.floor((Math.random() * 10) + 1);
        // Key Generator Algorithm
        /* The key will have three part: #### / #### / ####
        Each part is seperately encoded in Base64
        
        1) First part is MD5 hash of application name encoded in base64
        2) Second part is Expiry date in YYYY-MM-DD format encoded in Base64
        3) Last part is random number between 1 to 10 encoded in Base64

        After base64 convertion first two part will be changed to make the key difficult to decode.
        Each character of first and second part will be changed to next or previous nth charecter based on
        ASCII value. Here n is the random number placed in last part of the key. For odd postion next nth
        character and even position previous nth charecter will be considered.

        Example:
                Let first part is: ABCD
                Randome Number is: 2
                Base64 of ABCD is: QUJDRA==
                Converted string is: SSLBT??;

        So new key = changed base64 of md5 application name / changed base64 of validity / base64 of random number
        
        While decoding last part will be decoded first. Then based on that number first and second part
        will be changed. In this case for odd position previous nth character and
        for even positon next nth character will be considered. After that first part will be decoded
        to base64 which will give a MD5 hash. If that hash matches with the application name converted
        in MD5 then its a valid key. Second part will be then decoded to implement valid key logic. */
        // Application name conversion
        this.applicationNameMd5 = Md5.hashStr(this.applicationName);
        this.applicationNameBase64 = btoa(this.applicationNameMd5);
        var covertedNameArray = [];
        for (var i = 0; i < this.applicationNameBase64.length; i++) {
            if ((i % 2) == 1) {
                //Odd Position
                covertedNameArray.push(String.fromCharCode(this.applicationNameBase64.charAt(i).charCodeAt() + this.randomValue));
            }
            else {
                //Even Position
                covertedNameArray.push(String.fromCharCode(this.applicationNameBase64.charAt(i).charCodeAt() - this.randomValue));
            }
        }
        this.applicationNameConverted = covertedNameArray.toString().replace(/,/g, "");
        //validity date conversion
        this.validityDateBase64 = btoa(this.validityDate);
        var covertedValidityArray = [];
        for (var i = 0; i < this.validityDateBase64.length; i++) {
            if ((i % 2) == 1) {
                //Odd Position
                covertedValidityArray.push(String.fromCharCode(this.validityDateBase64.charAt(i).charCodeAt() + this.randomValue));
            }
            else {
                //Even Position
                covertedValidityArray.push(String.fromCharCode(this.validityDateBase64.charAt(i).charCodeAt() - this.randomValue));
            }
        }
        this.validityDateConverted = covertedValidityArray.toString().replace(/,/g, "");
        //Random number conversion
        this.randomValueBase64 = btoa(this.randomValue);
        //final key generation
        this.finalKey = this.applicationNameConverted + " / " + this.validityDateConverted + " / " + this.randomValueBase64;
    };
    return keygeneratorComponent;
}());
keygeneratorComponent = __decorate([
    Component({
        selector: 'key-generator',
        templateUrl: './keygenerator.component.html'
    }),
    __metadata("design:paramtypes", [FormBuilder])
], keygeneratorComponent);
export { keygeneratorComponent };
//# sourceMappingURL=keygenerator.component.js.map