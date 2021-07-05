import React, { useEffect, useState } from 'react'
import { PickLogo } from '../../components/pick-logo/pick-logo'
import './login.css'
import { Form, Input, Button, Message,Icon } from 'semantic-ui-react'
import { fetchUser, login, createPassword, resetPassword, forgotPassword } from '../../controller/user/userSlice'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AmplifyEnum } from '../../utils/amplifyAuth';
import { fetchToken } from '../../controller/token/tokenSlice';

export const Login = () => {
    const formInfo = {
        username: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        code: ""
    }

    let { search } = useLocation();
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
    const tokenState = useSelector((state) => state.token.status);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const completeForgotPassword = () => {
        setPasswordMismatch(formData.password !== formData.confirmPassword);
        if(!passwordMismatch) {
            resetPassword(formData.username, formData.password, formData.code).then((result) => {
                if(result?.error === AmplifyEnum.inValidUser) {
                    setLoader(false);
                    alert("Something went wrong resetting password.");
                } else {
                    setToken();
                }
            });
        }
    }

    const completeLogin = () => {
        setPasswordMismatch(formData.newPassword !== formData.confirmPassword);
        if(!passwordMismatch) {
            createPassword(formData.username, formData.password, formData.newPassword).then((result) => {
                if(result?.error === AmplifyEnum.inValidUser) {
                    setLoader(false);
                    alert("Something went wrong completing login.");
                } else {
                    setToken();
                }
            });
        }
    }

    const authorize = () => {
        login(formData.username, formData.password).then((result) => {
            setLoader(false);
            if(result.error === AmplifyEnum.inValidUser) {
                setPasswordIncorrect(true);
            } else if(result.challengeName != null && result.challengeName === AmplifyEnum.needNewPassword) {
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

    const attemptLogin = event => {
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
        setPasswordIncorrect(false);
        setEmptyUsername(false);
        setFormData({...formData, password: ''});
        setForgotPasswordForm(true);
        setTitle('Whoops...');
        forgotPassword(formData.username);
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
        if(tokenState === 'complete' && username !== '' && password !== '') {
            dispatch(fetchUser(username, password));
        }
    }, [tokenState, username, password, dispatch]);

    return (
        <div className="loginContainer">
            <div className="loginHeader">
                <div>
                    <PickLogo sizeParam="'m'"></PickLogo>
                </div>
                <div className="loginTitle">
                    {title}
                </div>
                { forgotPasswordForm && 
                <Message warning>
                    <Icon name='info circle'/>
                    Check your email for a code.
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
                { passwordIncorrect && 
                <Message warning>
                    <Icon name='help circle'/>
                    Forgot Password?&nbsp;<div onClick={showForgotPassword}>Reset here.</div>
                </Message> }
            </div>
        </div>  
    );
} 
