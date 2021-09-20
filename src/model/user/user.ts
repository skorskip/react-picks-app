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
    user_inits:         string;
    slack_user_id:      string;

    constructor(
        user_id :           number,
        user_name :         string,
        email :             string,
        first_name:         string,
        last_name:          string,
        status:             string,
        type:               string,
        last_login_date:    Date,
        user_inits:         string,
        slack_user_id:      string
    ){
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.status = status;
        this.type = type;
        this.last_login_date = last_login_date;
        this.user_inits = user_inits;
        this.slack_user_id = slack_user_id;
    }
}