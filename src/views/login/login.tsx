import React, { useEffect, useState } from 'react'
import { PickLogo } from '../../components/pick-logo/pick-logo'
import './login.css'
import { Form, Input, Button, Message,Icon } from 'semantic-ui-react'
import { fetchUser, login, createPassword, resetPassword, forgotPassword } from '../../controller/user/userSlice'
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AmplifyEnum } from '../../utils/amplifyAuth';
import { fetchToken } from '../../controller/token/tokenSlice';
import { status } from '../../configs/status'
import { RootState } from '../../store'
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice'
import { SHOW_MESSAGE } from '../../configs/topics'
import { SnackMessage } from '../../components/message/messagePopup'

export const Login = () => {
    const formInfo = {
        username: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        code: ""
    }

    let { search } = useLocation();
    let history = useHistory();
    const query = new URLSearchParams(search);
    const loginType = query.get("type");
    const [title, setTitle] = useState('pickem');
    const [completeLoginForm, setCompleteLoginForm] = useState(false);
    const [forgotPasswordForm, setForgotPasswordForm] = useState(loginType !== null ? loginType==="newpassword" : false);
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [emptyUsername, setEmptyUsername] = useState(false);
    const [formData, setFormData] = useState(formInfo);
    const [laoder, setLoader] = useState(false);
    const tokenState = useSelector((state: RootState) => state.token.status);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const userState = useSelector((state: RootState) => state.user.status);
    const dispatch = useDispatch();

    const handleChange = (event: { target: { name: any; value: any } }) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const completeForgotPassword = () => {
        setPasswordMismatch(formData.password !== formData.confirmPassword);
        if(formData.password !== '' && formData.password === formData.confirmPassword) {
            resetPassword(formData.username, formData.password, formData.code).then((result) => {
                setLoader(false);
                setToken();
                setForgotPasswordForm(false);
            });
        }
    }

    const completeLogin = () => {
        setPasswordMismatch(formData.newPassword !== formData.confirmPassword);
        if(formData.password !== '' && formData.newPassword === formData.confirmPassword) {
            createPassword(formData.username, formData.password, formData.newPassword).then((result) => {
                setLoader(false);
                setToken();
                setCompleteLoginForm(false);
            });
        }
    }

    const authorize = () => {
        login(formData.username, formData.password).then((result) => {
            setLoader(false);
            if(result.error === AmplifyEnum.inValidUser) {
                setPasswordIncorrect(true);
            } else if(result.response.challengeName != null && 
                result.response.challengeName === AmplifyEnum.needNewPassword) {
                    
                setTitle('Welcome!');
                setCompleteLoginForm(true);
            } else {
                setToken();
            } 
        });
    }
    
    const setToken = () => {
        dispatch(fetchToken());
        setUsername(formData.username);
        setPassword(formData.password);
    }

    const attemptLogin = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoader(true);
        if(formData.username === '') {
            setLoader(false);
            setEmptyUsername(true);
        } else {
            if(forgotPasswordForm) {
                completeForgotPassword();
            } else if(completeLoginForm) {
                completeLogin();
            } else {
                authorize();
            }
        }
    }

    const showForgotPassword = () => {
        if(formData.username !== '') {
            setPasswordIncorrect(false);
            setEmptyUsername(false);
            setFormData({...formData, password: ''});
            setForgotPasswordForm(true);
            setTitle('Whoops...');
            forgotPassword(formData.username);
        } else {
            setEmptyUsername(true);
        }
    }

    const usernameForm = !completeLoginForm && (
        <Form.Field
            control={Input}
            name="username"
            placeholder="Username/Email"
            type="text"
            icon='user'
            iconPosition='left'
            onChange={handleChange} 
            value={formData.username}
            className="loginInput"
            error={(emptyUsername && {
                content: 'Must provide username or email',
                pointing: 'above'
            }) || passwordIncorrect}
        />
    );

    const codeForm = forgotPasswordForm && (
        <Form.Field 
            control={Input}
            name="code"
            type="text"
            placeholder="Verification code"
            icon='key'
            iconPosition='left'
            className="loginInput"
            onChange={handleChange}
            value={formData.code}
        />
    );

    const passwordForm = !completeLoginForm &&(
        <Form.Field
            control={Input}
            name='password'
            placeholder={forgotPasswordForm ? "New Password" : "Password"}
            icon='lock'
            iconPosition='left'
            type="password"
            className="loginInput"
            onChange={handleChange} 
            value={formData.password}
            error={passwordIncorrect && {
                content: 'Username or password incorrect',
                pointing: 'above'
            }}
        />
    );

    const newPasswordForm = completeLoginForm && (
        <Form.Field
            control={Input}
            name='newPassword'
            placeholder='New Password'
            icon='lock'
            iconPosition='left'
            type="password"
            className="loginInput"
            onChange={handleChange} 
            value={formData.newPassword}
            error={passwordIncorrect && {
                content: 'Username or password incorrect',
                pointing: 'above'
            }}
        />
    );

    const passwordConfirmForm = (forgotPasswordForm || completeLoginForm) && (
        <Form.Field
            control={Input}
            name='confirmPassword'
            placeholder='Confirm password'
            type='password'
            icon='lock'
            iconPosition='left'
            onChange={handleChange} 
            value={formData.confirmPassword}
            className="loginInput"
            error={passwordMismatch && { 
                content: 'Passwords do not match.',
                pointing: 'above'
            }}
        />
    );

    useEffect(() => {
        if(tokenState === status.COMPLETE && username !== '' && password !== '') {
            dispatch(fetchUser());
            history.push("/");
        }
    }, [tokenState, username, password, dispatch, history]);

    useEffect(() => {
        if(userState === status.ERROR) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }, [userState, dispatch]);

    return (
        <div className="loginContainer">
            <div className="loginHeader">
                <div>
                    <PickLogo sizeParam="'m'"></PickLogo>
                </div>
                <div className="loginTitle secondary-color">
                    {title}
                </div>
                { forgotPasswordForm && 
                <Message warning>
                    <Icon name='info circle'/>
                    Check your email for a code.
                </Message> }
                { completeLoginForm && 
                <Message warning>
                    <Icon name='info circle'/>
                    Create a new password.
                </Message> }
                <Form onSubmit={attemptLogin} className="loginForm" size='big'>
                    { usernameForm }
                    { codeForm }
                    { passwordForm }
                    { newPasswordForm }
                    { passwordConfirmForm }

                    {laoder ? 
                        <Button loading size="huge" className="loginButton primary-background base-color noSelect">Loading</Button>:
                        <Button content="Login" type="submit" size="huge" className="loginButton primary-background base-color noSelect" />
                    }
                </Form>
                <br></br>
                <div className="forgot-password-link secondary-color">
                    Forgot Password? &nbsp;<div className="link" onClick={showForgotPassword}>Reset here.</div>
                </div>
            </div>
        </div>  
    );
} 
