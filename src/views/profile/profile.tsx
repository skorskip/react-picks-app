import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { selectUser, signOut, forgotPassword, fetchUpdateProfile, fetchUser, setSlackUserId} from '../../controller/user/userSlice';
import { useHistory } from 'react-router-dom';
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice';
import { SET_THEME } from '../../configs/topics';
import { RootState, useAppThunkDispatch } from '../../store';
import { status } from '../../configs/status';
import { ProfileImage } from '../../components/profile-image/profile-image';
import { PickButton } from '../../common/PickButton/PickButton';
import { Themes } from './components/themes';
import { selectMessageSource } from '../../controller/league/leagueSlice';
import './profile.scss';

export const Profile = () => {
    const user = useSelector(selectUser);
    const updateProfileState = useSelector((state:RootState) => state.user.setProfileStatus);
    const slackState = useSelector((state:RootState) => state.user.slackIdState);
    const messageSource = useSelector(selectMessageSource);
    const history = useHistory();
    const dispatch = useAppThunkDispatch();
    const [slackEmail, setSlackEmail] = useState('');

    const signOutUser = () => {
        let dialogConfirm = window.confirm("Are you sure you want to sign out?");
        if(dialogConfirm) {
            dispatch(signOut());
            history.push("/login");
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

    const setSlackEmailInput = (event: { target: { value: any } }) => {
        setSlackEmail(event.target.value);
    }

    const connectSlack = () => {
        dispatch(setSlackUserId(slackEmail));
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
                </div>
                <div className="card-header-text-profile">
                    { user.first_name } { user.last_name }
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

    const slackInfo = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-header-profile">
                    Slack
                </div>
                {
                    (!user.slack_user_id) && (<div className="info-content">
                        <div className="info-field-col">
                            <div >Integrate with slack by joining the picksapp <a href={`https://picks-league.slack.com/channels/${messageSource.channel}`}>slack channel</a> and connecting your email to get access to awesome features:</div>
                            <ul>
                                <li>Be able to get notified to make picks</li>
                                <li>Create a custom profile picture</li>
                            </ul>
                        </div>
                        <div className="info-field-col">
                            <input
                                className='slack-email-input base-background secondary-color'
                                placeholder='Slack Profile Email'
                                onChange={setSlackEmailInput}>
                            </input>
                            <PickButton 
                                type='secondary'
                                content={(slackState === status.LOADING) ? undefined : 'Connect'}
                                styling='connect-slack-button'
                                clickEvent={connectSlack}
                                loading={slackState === status.LOADING}
                            />
                        </div>
                    </div>)
                } 
                {
                    (user.slack_user_id) && (
                        <div className="info-content">
                            <div className="change-password-button-container">
                                <PickButton 
                                    type='secondary'
                                    content={(updateProfileState === status.LOADING) ? undefined : 'Update Image From Slack'}
                                    styling='change-password-button'
                                    clickEvent={updateProfileImage}
                                    loading={updateProfileState === status.LOADING}
                                />
                            </div>
                    </div>)
                }
            </div>
        </div>
    )

    return (
        <div className="profile-container">
            { profileTitle }
            { profileInfo }
            { slackInfo }
            <Themes themeClickEvent={toggleTheme}/>
            <div className="logout-button-container">
                <PickButton 
                    clickEvent={signOutUser} 
                    styling="update-profile-button" 
                    type="failure"
                    content="Sign out"
                />
            </div>
        </div>
    );
}