export const UserTypeEnum = {
    PARTICIPANT: "participant"
}

export class User {

    user_id :           number;
    user_name :         string;
    email :             string;
    first_name:         string;
    last_name:          string;
    status:             string;
    type:               string;
    last_login_date:    Date;

    constructor(
        user_id :           number,
        user_name :         string,
        email :             string,
        first_name:         string,
        last_name:          string,
        status:             string,
        type:               string,
        last_login_date:    Date
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