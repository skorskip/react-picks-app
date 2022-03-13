import React from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { selectUser, signOut, forgotPassword, fetchUpdateProfile, fetchUser} from '../../controller/user/userSlice';
import './profile.scss';
import { UserStats } from '../../components/user-stats/user-stats';
import { useHistory } from 'react-router-dom';
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice';
import { SET_THEME } from '../../configs/topics';
import { RootState, useAppThunkDispatch } from '../../store';
import { status } from '../../configs/status';
import { ProfileImage } from '../../components/profile-image/profile-image';
import { PickButton } from '../../common/PickButton/PickButton';
import { Themes } from './components/themes';

export const Profile = () => {
    const user = useSelector(selectUser);
    const updateProfileState = useSelector((state:RootState) => state.user.setProfileStatus);
    const history = useHistory();
    const dispatch = useAppThunkDispatch();

    const signOutUser = () => {
        let dialogConfirm = window.confirm("Are you sure you want to sign out?");
        if(dialogConfirm) {
            dispatch(signOut());
        }
    }

    const changePassword = () => {
        let dialogConfirm = window.confirm("Are you sure you want to reset password?");
        if(dialogConfirm) {
            dispatch(signOut());
            forgotPassword(user.email);
            history.push("/login?type=newpassword");
        }
    }

    const toggleTheme = (newTheme: string) => {
        dispatch(publish(new PubSub(SET_THEME, newTheme)));
    }

    const updateProfileImage = async () => {
        let dialogConfirm = window.confirm("Update profile image with Slack image?");
        if(dialogConfirm) {
            dispatch(fetchUpdateProfile()).then(() => dispatch(fetchUser()));
        }
    }

    const profileTitle = (
        <div className="card-title base-background tiertary-color">
            <div className="card-header-profile secondary-color">
                <div>
                    <ProfileImage 
                        size="m" 
                        content={user.user_inits} 
                        image={user.slack_user_image} 
                        showImage={true}
                    />
                    <PickButton 
                        type='secondary'
                        content={(updateProfileState === status.LOADING) ? undefined : 'Update'}
                        styling='update-profile-button'
                        clickEvent={updateProfileImage}
                        loading={updateProfileState === status.LOADING}
                    />
                </div>
                <div className="card-header-text-profile">
                    { user.first_name } { user.last_name }
                </div>
            </div>
        </div>
    );

    const profileStats = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-content">
                    <UserStats />
                </div>
            </div>
        </div>

    );

    const profileInfo = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-header-profile">
                    Info
                </div>
                <div className="info-content">
                    <div className="info-field">
                        <div className="profile-icon-container primary-color">
                            <div className="primary-color">
                                <Icon name="user"/>
                            </div>
                        </div>
                        <div className="field">
                            { user.user_name }
                        </div>
                    </div>
                    <div className="info-field">
                        <div className="profile-icon-container primary-color">
                            <Icon name="mail"/>
                        </div>
                        <div className="field">
                            { user.email }
                        </div>
                    </div>
                    <div className="change-password-button-container">
                        <PickButton 
                            clickEvent={changePassword} 
                            styling="change-password-button" 
                            type="secondary" 
                            content="Reset password" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            { profileTitle }
            { profileStats }
            { profileInfo }
            <Themes themeClickEvent={toggleTheme}/>
            <div className="logout-button-container">
                <PickButton 
                    clickEvent={signOutUser} 
                    styling="change-password-button" 
                    type="failure"
                    content="Sign out"
                />
            </div>
        </div>
    );
}