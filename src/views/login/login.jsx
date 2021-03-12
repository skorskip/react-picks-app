import React, { useState } from 'react'
import { PickLogo } from '../../components/pick-logo/pick-logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './login.css'
import { Form, Icon, Button, Card } from 'react-bulma-components'
import { faKey, faLock, faUserAlt } from '@fortawesome/free-solid-svg-icons'
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
        <Form.Field>
            <Form.Control iconLeft>
                <Form.Input className="is-medium" name="username" color={passwordIncorrect ? "danger" : null} type="text" placeholder="Username/Email" onChange={handleChange} value={formData.username}/>
                <Icon align="left">
                    <FontAwesomeIcon className="primary" icon={faUserAlt} />
                </Icon>
            </Form.Control>
            { emptyUsername && <Form.Help align="left" color="danger">Must provide username or email</Form.Help>}
        </Form.Field>
    );

    const codeForm = forgotPasswordForm && (
        <Form.Field>
            <Form.Control iconLeft>
                <Form.Input className="is-medium" name="code" type="text" placeholder="Verification code" onChange={handleChange} value={formData.code}/>
                <Icon align="left">
                    <FontAwesomeIcon className="primary" icon={faKey} />
                </Icon>
            </Form.Control>
        </Form.Field>
    );

    const passwordForm = (
        <Form.Field>
            <Form.Control iconLeft>
                    <Form.Input className="is-medium" name="password" color={passwordIncorrect ? "danger" : null} type="password" placeholder={forgotPasswordForm ? "New Password" : "Password"} onChange={handleChange} value={formData.password}/>
                <Icon align="left">
                    <FontAwesomeIcon className="primary" icon={faLock} />
                </Icon>
            </Form.Control>
            { passwordIncorrect && <Form.Help align="left" color="danger"><a onClick={forgotPassword}>Forgot Password?</a></Form.Help> }
        </Form.Field>
    );

    const passwordConfirmForm = (forgotPasswordForm || completeLoginForm) && (
        <Form.Field>
            <Form.Control iconLeft>
                <Form.Input className="is-medium" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} value={formData.confirmPassword}/>
                <Icon align="left">
                    <FontAwesomeIcon className="primary" icon={faLock} />
                </Icon>
            </Form.Control>
            { passwordMismatch && <Form.Help align="left" color="danger">Passwords don't match</Form.Help>}
        </Form.Field>
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

            <form onSubmit={attemptLogin} className="loginForm">

                { usernameForm }
                { codeForm }
                { passwordForm }
                { passwordConfirmForm }

                {laoder ? 
                    <Button loading className="loginButton primary-background base noSelect"></Button> :
                    <Button type="submit" className="loginButton primary-background base noSelect">
                        Login
                    </Button>
                }
            </form>

            </div>
        </div>  
    );
} 
