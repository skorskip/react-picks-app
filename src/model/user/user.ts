export const UserTypeEnum = {
    PARTICIPANT: "participant"
}

export class User {

    user_id : Number;
    user_name : String;
    email : String;
    first_name: String;
    last_name: String;
    status: String;
    type: String;
    last_login_date: Date;

    constructor(
        user_id, 
        user_name, 
        email, 
        first_name,
        last_name, 
        status, 
        type, 
        last_login_date
    ){
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.status = status;
        this.type = type;
        this.last_login_date = last_login_date;
    }
}