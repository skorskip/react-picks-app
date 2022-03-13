export class Message {
    date: string
    message: string

    constructor(date: string, message: string) {
        this.date = date;
        this.message = message;
    }
}

export class Announcement {
    announcements: number
    announcement_date: string
    messages: Message[]

    constructor(announcement: number, announcement_date: string, messages: Message[]){
        this.announcements = announcement;
        this.announcement_date = announcement_date;
        this.messages = messages;
    }

}