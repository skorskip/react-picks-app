import { Game, GameStatusEnum, GameWinStatusEnum } from "../model/week/game";
import { Pick } from "../model/week/pick";

export const toInt = (convert: string | null) => {
    if(convert) {
        let converted = parseInt(convert);
        if(isNaN(converted)) {
            return null;
        }
        return converted;
    } else {
        return null;
    }
}

export const pickResult = (game: Game, pick: Pick | undefined) => {
    if(game.game_status === GameStatusEnum.completed && pick != null){
        if(pick.team_id === game.winning_team_id) {
          return GameWinStatusEnum.win;
        } else if(game.winning_team_id === null) {
          return GameWinStatusEnum.push;
        } else {
          return GameWinStatusEnum.loss;
        }
      }
      else {
        return null;
      }
}