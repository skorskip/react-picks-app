export class User {
    constructor(user_id, user_name, password, email, first_name, last_name, status, type, last_login_date){
        this.user_id = user_id;
        this.user_name = user_name;
        this.password = password;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.status = status;
        this.type = type;
        this.last_login_date = last_login_date;
    }
}