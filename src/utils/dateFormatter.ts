import { Game, GameStatusEnum } from '../model/game/game';

const months = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export const formatDate = (date: Date) => {
    var formattedDate = "";

    switch(date.getDate()) {
      case new Date().getDate():
        formattedDate += "Today";
        break;
      case new Date().getDate() + 1:
          formattedDate += "Tomorrow";
          break;
      default:
        formattedDate += new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date)
        break; 
    }

    formattedDate += " at "

    let minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();

    if(date.getHours() > 12) {
      formattedDate += (date.getHours() - 12) + ":" + minutes + "PM"
    } else {
      formattedDate += date.getHours() + ":" + minutes + "AM"
    }

    return formattedDate;
}

export const gameTimeStatusQuarters = (game: Game) => {
    if(game.game_status === GameStatusEnum.unplayed || game.game_status === null) {
        if(new Date(game.pick_submit_by_date) < new Date()){
          return "Start time: " + formatDate(new Date(game.start_time));
        }
      } else {
        if(game.game_status === GameStatusEnum.completed) {
          return "Final";
        } else {
          var minutes = String(Math.floor(game.seconds_left_in_quarter / 60));
          var seconds = String(game.seconds_left_in_quarter % 60);
         
          if(parseInt(seconds) < 10) { seconds = "0" + seconds}
  
          if(parseInt(minutes) === 0 && parseInt(seconds) === 0 && game.current_quarter !== 2) { 
            return "Q" + game.current_quarter + " - END";
          } else if(parseInt(minutes) === 0 && parseInt(seconds) === 0 && game.current_quarter === 2) {
            return "HALFTIME"
          } else {
            return "Q" + game.current_quarter + " - " + minutes + ":" + seconds;
          }
        }
    }
}