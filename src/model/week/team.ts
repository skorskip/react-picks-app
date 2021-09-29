export class Team {

    team_id :           number;
    primary_color:      string;
    secondary_color:    string;
    display_color:      string;
    team_name:          string;
    abbreviation:       string;

    constructor(
        team_id :           number,
        primary_color:      string,
        secondary_color:    string,
        display_color:      string,
        team_name:          string,
        abbreviation:       string
    ) {
        this.team_id = team_id;
        this.primary_color = primary_color;
        this.secondary_color = secondary_color;
        this.display_color = display_color;
        this.team_name = team_name;
        this.abbreviation = abbreviation;
    }
}

export class TeamSelect {
    team: Team;
    highlight: boolean;

    constructor(team: Team, highlight: boolean) {
        this.team = team;
        this.highlight = highlight;
    }
}