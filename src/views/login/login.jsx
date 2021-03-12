import React, { useState } from 'react'
import { PickLogo } from '../../components/pick-logo/pick-logo'
import './login.css'
import { Form, Input, Button, Message,Icon } from 'semantic-ui-react'
import AmplifyAuth, { AmplifyEnum } from '../../utils/amplifyAuth'
import store from '../../store'
import { fetchUser } from '../../controller/user/userSlice'

export const Login = () => {
    const formInfo = {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        authUser: {},
    }

    const [title, setTitle] = useState('pickem');
    const [completeLoginForm, setCompleteLoginForm] = useState(false);
    const [forgotPasswordForm, setForgotPasswordForm] = useState(false);
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [emptyUsername, setEmptyUsername] = useState(false);
    const [formData, setFormData] = useState(formInfo);
    const [laoder, setLoader] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        });
    }

    const completeForgotPassword = () => {
        setPasswordMismatch(formData.password !== formData.confirmPassword);
        if(!passwordMismatch) {
            AmplifyAuth.ForgotPassword(formData.username, formData.password, formData.code).then((result) => {
                if(result.error === AmplifyEnum.inValidUser) {
                    alert("Something went wrong");
                } else {
                    getUserInfo();
                }
            });
        }
    }

    const completeLogin = () => {
        setPasswordMismatch(formData.password !== formData.confirmPassword);
        if(!passwordMismatch) {
            AmplifyAuth.CompletePasswordLogin(formData.password, formData.authUser).then((result) => {
                if(result.error === AmplifyEnum.inValidUser) {
                    alert("Something went wrong");
                } else {
                    getUserInfo();
                }
            });
        }
    }

    const authorize = () => {
        AmplifyAuth.AmplifyLogin(formData.username, formData.password).then((result) => {
            setLoader(false);
            if(result.error === AmplifyEnum.inValidUser) {
                setPasswordIncorrect(true);
            } else if(result.challengeName != null && result.challengeName === AmplifyEnum.needNewPassword) {
                setFormData({...formData, authUser: result});
                setTitle('Welcome!');
                setCompleteLoginForm(true);
                setFormData({...formData, password: ''});
            } else {
                getUserInfo();
            }
        });
    }
    
    const getUserInfo = () => {
        store.dispatch(fetchUser(formData.username, formData.passsword));
        setLoader(false);
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

    const forgotPassword = () => {
        setPasswordIncorrect(false);
        setEmptyUsername(false);
        setFormData({...formData, password: ''});
        setForgotPasswordForm(true);
        setTitle('Whoops...');
        AmplifyAuth.SendForgotPasswordCode(formData.username);
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
            error={emptyUsername && {
                content: 'Must provide username or email',
                pointing: 'above'
            } || passwordIncorrect}
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

    const passwordForm = (
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
    )

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
                    { passwordConfirmForm }

                    {laoder ? 
                        <Button loading basic className="loginButton primary-background base noSelect">Loading</Button>:
                        <Button basic content="Login" type="submit" className="loginButton primary-background base noSelect" />
                    }
                </Form>
                { passwordIncorrect && 
                <Message warning>
                    <Icon name='help circle'/>
                    Forgot Password?&nbsp;<a onClick={forgotPassword}>Reset here.</a>
                </Message> }
            </div>
        </div>  
    );
} 
