import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { selectUser, signOut, forgotPassword} from '../../controller/user/userSlice';
import './profile.css';
import { UserStats } from '../../components/user-stats/user-stats';
import { useHistory } from 'react-router-dom';

export const Profile = () => {
    const user = useSelector(selectUser);
    const history = useHistory();
    const dispatch = useDispatch();

    const signOutUser = () => {
        dispatch(signOut());
    }

    const changePassword = () => {
        forgotPassword(user.email);
        history.push("/login?type=newpassword")
    }

    const profileTitle = (
        <div className="card-title base-background tiertary-color">
            <div className="card-header-profile secondary-color">
                <div className="init-header-icon primary-color">
                    { user.user_inits }
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
                        <div className="icon-container primary-color">
                            <div className="primary-color">
                                <Icon name="user"/>
                            </div>
                        </div>
                        <div className="field">
                            { user.user_name }
                        </div>
                    </div>
                    <div className="info-field">
                        <div className="icon-container primary-color">
                            <Icon name="mail"/>
                        </div>
                        <div className="field">
                            { user.email }
                        </div>
                    </div>
                    <div className="change-password-button-container">
                        <Button className="change-password-button secondary-color base-background" onClick={changePassword}>
                            Change password
                        </Button>
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
            <div className="logout-button-container">
                <Button className="change-password-button failure-color base-background" onClick={signOutUser}>
                    Sign out
                </Button>
            </div>
        </div>
    );
}