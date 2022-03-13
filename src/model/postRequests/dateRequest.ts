export class DateRequest {
    lastCheckDate: string | null;

    constructor(lastCheckDate: string | null) {
        this.lastCheckDate = lastCheckDate;
    }
}