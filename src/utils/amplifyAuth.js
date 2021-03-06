import { Auth } from 'aws-amplify';
import { setTokenLocal } from './localData';

export const AmplifyEnum = {
    needNewPassword: 'NEW_PASSWORD_REQUIRED',
    inValidUser: 'INVALID_USER',
    emailFail: 'SEND_EMAIL_FAILED',
    success :'SUCCESS'
}

export default class AmplifyAuth {
    
    static async AmplifyLogin (username, password) {
        try {
            const response = await Auth.signIn({username: username, password: password});
            if(response.challengeName === AmplifyEnum.needNewPassword) {
                return response;
            } else {
                const signedInUser = await Auth.currentSession();
                setTokenLocal(signedInUser.getIdToken().getJwtToken());
                return response;
            }
        } catch(error) {
            throw error;
        }
    }

    static async CompletePasswordLogin(username, tempPassword, newPassword) {
        try {
            const response = await Auth.signIn({username: username, password: tempPassword});
            const { requiredAttributes } = response.challengeParam;
            await Auth.completeNewPassword(response, newPassword, requiredAttributes);
            return {success: AmplifyEnum.success};
        } catch(error) {
            throw error;
        }
    }

    static async ForgotPassword(username, password, code) {
        try {
            const response = await Auth.forgotPasswordSubmit(username, code, password);
            return response;
        } catch(error) {
            throw error;
        }
    }

    static async SendForgotPasswordCode(username) {
        try {
            const response = await Auth.forgotPassword(username);
            return response;
        } catch(error) {
            throw error;
        }
    }

    static async SignOut() {
        try {
            const response = await Auth.signOut({global: true});
            return response;
        } catch(error) {
            throw error;
        }
    }

    static async FetchCurrentSession () {
        try {
            const response = await Auth.currentSession();
            var expiration = new Date(response.getIdToken().getExpiration() * 1000);
            if(new Date() > expiration) {
                return null;
            } else {
                setTokenLocal(response.getIdToken().getJwtToken());
                return response.getIdToken().getJwtToken();
            }
        } catch(error) {
            throw error;
        }
    }
}