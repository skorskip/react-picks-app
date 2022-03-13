import { Auth } from 'aws-amplify';
import { status } from '../configs/status';
import { setTokenLocal } from './localData';

export const AmplifyEnum = {
    needNewPassword: 'NEW_PASSWORD_REQUIRED',
    inValidUser: 'INVALID_USER',
    emailFail: 'SEND_EMAIL_FAILED',
    success :'SUCCESS'
}

export default class AmplifyAuth {
    
    static async AmplifyLogin (username: string, password: string) {
        try {
            const response = await Auth.signIn({username: username, password: password});
            if(response.challengeName === AmplifyEnum.needNewPassword) {
                return {status: status.SUCCESS, response: response, error: null};
            } else {
                const signedInUser = await Auth.currentSession();
                setTokenLocal(signedInUser.getIdToken().getJwtToken());
                return {status: status.SUCCESS, response: response, error: null};
            }
        } catch(error) {
            throw error;
        }
    }

    static async CompletePasswordLogin(username: string, tempPassword: string, newPassword: string) {
        try {
            const response = await Auth.signIn({username: username, password: tempPassword});
            const { requiredAttributes } = response.challengeParam;
            await Auth.completeNewPassword(response, newPassword, requiredAttributes);
            return {status: status.SUCCESS};
        } catch(error) {
            throw error;
        }
    }

    static async ForgotPassword(username: string, password: string, code: string) {
        try {
            const response = await Auth.forgotPasswordSubmit(username, code, password);
            return {status: status.SUCCESS, response: response};
        } catch(error) {
            throw error;
        }
    }

    static async SendForgotPasswordCode(username: string) {
        try {
            const response = await Auth.forgotPassword(username);
            return {status: status.SUCCESS, response: response};
        } catch(error) {
            throw error;
        }
    }

    static async SignOut() {
        try {
            const response = await Auth.signOut({global: true});
            return {status: status.SUCCESS, response: response};
        } catch(error) {
            throw error;
        }
    }

    static async FetchCurrentSession() {
        try {
            const response = await Auth.currentSession();
            var expiration = new Date(response.getIdToken().getExpiration() * 1000);
            if(new Date() > expiration) {
                return {status: status.SUCCESS, response: null};
            } else {
                setTokenLocal(response.getIdToken().getJwtToken());
                return {status: status.SUCCESS, response: response.getIdToken().getJwtToken()}
            }
        } catch(error) {
            throw error;
        }
    }
}