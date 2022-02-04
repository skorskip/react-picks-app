import { Game, GameStatusEnum } from '../model/week/game';

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
    formattedDate += date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

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

export const showSubmitTime = (game: Game, prevGame: Game  | null) => {
  let currGame = game;
  let submitTime1 = currGame == null ? null : currGame.pick_submit_by_date;
  
  if(submitTime1 != null && prevGame == null) {
      return (new Date(submitTime1) > new Date()) as boolean;
  } else if(submitTime1 != null && prevGame != null){
      let submitTime2 = prevGame?.pick_submit_by_date;
      return ((submitTime1 !== submitTime2) && (new Date(submitTime1) > new Date())) as boolean;
  } else {
      return false;
  }
}