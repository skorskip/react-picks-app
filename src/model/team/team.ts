export class Team {

    team_id : Number;
    primary_color: String;
    secondary_color: String;
    display_color: String;
    team_name: String;
    abbreviation: String;

    constructor(
        team_id,
        primary_color,
        secondary_color,
        display_color,
        team_name,
        abbreviation
    ) {
        this.team_id = team_id;
        this.primary_color = primary_color;
        this.secondary_color = secondary_color;
        this.display_color = display_color;
        this.team_name = team_name;
        this.abbreviation = abbreviation;
    }
}