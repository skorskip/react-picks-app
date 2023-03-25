import { ProfileImage } from "../../../../components/profile-image/profile-image";
import { User } from "../../../../model/user/user";
import { PicksUserData } from "../../../../model/week/picksUserData";
import "./hot-streak.scss";

type Props = {
    users?: Array<User>,
    pickData?: Array<PicksUserData>
}

export const HotStreak = ({users, pickData} : Props) => {

    if(!users || !users.length) {
        return (<div className="empty-streak tiertary-color">
            No Streak
        </div>);
    }

    const hotStreakList = users.map(user => {
        return (<>
            <ProfileImage
                content={user.user_inits}
                image={user.slack_user_image}
                size='l'
                showImage={true}
            ></ProfileImage>
            <div className="user-pick-count warn-background base-color">
                {pickData?.filter(data => data.user_id === user.user_id).length}
            </div>
        </>);
    });

    return (
        <div className="list-container">
            {hotStreakList}
        </div>
    );
}