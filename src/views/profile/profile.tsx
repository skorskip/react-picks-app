import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { selectUser, signOut, forgotPassword} from '../../controller/user/userSlice';
import './profile.css';
import { UserStats } from '../../components/user-stats/user-stats';
import { useHistory } from 'react-router-dom';
import { themeList } from '../../configs/themes';
import { getThemeLocal, setThemeLocal } from '../../utils/localData';
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice';
import { SET_THEME, SHOW_MESSAGE } from '../../configs/topics';
import { RootState } from '../../store';
import { status } from '../../configs/status';
import { SnackMessage } from '../../components/message/messagePopup';
import { ProfileImage } from '../../components/profile-image/profile-image';

export const Profile = () => {
    const user = useSelector(selectUser);
    const userState = useSelector((state:RootState) => state.user.status)
    const history = useHistory();
    const dispatch = useDispatch();
    const [theme, setTheme] = useState(getThemeLocal() === null ? "light" : getThemeLocal());

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
        setThemeLocal(newTheme)
        setTheme(newTheme);
        dispatch(publish(new PubSub(SET_THEME, newTheme)));
    }

    const getThemeClass = (value: string) => {
        if(theme === value) {
            return "theme-button primary-background base-color";
        } else {
            return "theme-button secondary-color tiertary-light-background";
        }
    }

    const profileTitle = (
        <div className="card-title base-background tiertary-color">
            <div className="card-header-profile secondary-color">
                <ProfileImage size="m" content={user.user_inits} image={user.slack_user_image} showImage={true}/>
                <div className="card-header-text-profile">
                    { user.first_name } { user.last_name }
                </div>
            </div>
        </div>
    );

    const profileStats = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-header-profile">
                    Stats
                </div>
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
                        <Button className="change-password-button secondary-color tiertary-light-background" onClick={changePassword}>
                            Reset password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const themeListDisplay = themeList.map((item, i) => {
        return (
            <Button key={i + item.value} className={getThemeClass(item.value)} onClick={() => toggleTheme(item.value)}>
                {item.name}
            </Button>
        )
    });

    const themes = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-header-profile">
                    Themes
                </div>
                <div className="info-content">
                    <div className="info-field">
                        <div className="theme-content">
                            { themeListDisplay }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    useEffect(() => {
        if(userState === status.ERROR) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.USER.LOGIN_ERROR));
            dispatch(publish(request));
        }
    }, [userState, dispatch]);

    return (
        <div className="profile-container">
            { profileTitle }
            { profileStats }
            { profileInfo }
            { themes }
            <div className="logout-button-container">
                <Button className="change-password-button failure-color failure-light-background" onClick={signOutUser}>
                    Sign out
                </Button>
            </div>
        </div>
    );
}