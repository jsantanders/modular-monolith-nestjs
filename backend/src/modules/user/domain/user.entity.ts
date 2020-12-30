export class UserEntity {

    constructor(firstName : string){
        this._firstName =  firstName;
    }

    private _firstName : string;

    public get firstName() : string {
        return this._firstName;
    }
}
