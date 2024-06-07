import { GameLoader } from "../../../../components/game-loader/game-loader";
import { ProfileImage } from "../../../../components/profile-image/profile-image";
import { User } from "../../../../model/user/user";
import { PicksUserData } from "../../../../model/week/picksUserData";
import "./hot-streak.scss";

type Props = {
    users?: Array<User>,
    allGamesCompleted: boolean,
    userPicksData: Array<PicksUserData>,
    isLoading: boolean,
    showPickModal: (picksUserData: PicksUserData | undefined) => void
}

export const HotStreak = ({users, allGamesCompleted, userPicksData, isLoading, showPickModal} : Props) => {

    if(isLoading) {
        return (
            <div className="list-container">
                <GameLoader count={1} height={60} width={60} borderRadius="50%" rowCount={5}/>
            </div>
        )
    }

    if(allGamesCompleted && (!users || !users.length)) {
        return (<div className="empty-streak tiertary-color">
            No bonus winners this week
        </div>);
    }

    if(!users || !users.length) {
        return (<div className="empty-streak tiertary-color">
            No players currently in the running.
        </div>);
    }

    const compareFunc = (userA: User, userB: User) => {
        return (userB.wins || 0) - (userA.wins || 0);
    }

    const hotStreakList = [...users]?.sort((a,b) => compareFunc(a,b)).map(user => {
        return (
        <div onClick={() => showPickModal(userPicksData.find(u => u.user_id === user.user_id))}>
            <ProfileImage
                key={'hot-streak-' + user.user_id}
                content={user.user_inits}
                image={user.slack_user_image}
                size='l'
                showImage={true}
            ></ProfileImage>
            <div className="user-pick-count warn-background base-color">
                {user.wins}
            </div>
        </div>);
    });

    return (
        <div className="list-container">
            {hotStreakList}
        </div>
    );
}