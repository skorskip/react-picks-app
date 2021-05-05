import { Auth } from 'aws-amplify';

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
            if(response?.username) {
                if(response.challengeName === AmplifyEnum.needNewPassword) {
                    return response;
                } else {
                    const signedInUser = await Auth.currentSession();
                    localStorage.setItem("token", signedInUser.getIdToken().getJwtToken());
                    return response;
                }
            } else {
                return {error: AmplifyEnum.inValidUser}
            }
        } catch(error) {
            return {error: AmplifyEnum.inValidUser}
        }
    }

    static async CompletePasswordLogin(newPassword, authUser) {
        const { requiredAttributes } = authUser.challengeParam;
        try {
            await Auth.completeNewPassword(authUser, newPassword, requiredAttributes);
            const signedInUser = await Auth.currentSession();
            localStorage.setItem("token", signedInUser.getIdToken().getJwtToken());
            return {success: AmplifyEnum.success};
        } catch(error) {
            return {error: AmplifyEnum.inValidUser}
        }
    }

    static async ForgotPassword(username, password, code) {
        try {
            const response = await Auth.forgotPasswordSubmit(username, code, password);
            const signedInUser = await Auth.currentSession();
            localStorage.setItem("token", signedInUser.getIdToken().getJwtToken());
            return response;
        } catch(error) {
            return {error: AmplifyEnum.inValidUser}
        }
    }

    static async SendForgotPasswordCode(username) {
        try {
            const response = await Auth.forgotPassword(username);
            return response;
        } catch(error) {
            return {error: AmplifyEnum.emailFail}
        }
    }

    static async TokenIsValid() {
        try {
            const response = await Auth.currentSession();
            var expiration = new Date(response.getIdToken().getExpiration() * 1000);
            if(new Date() > expiration) {
                return false;
            } else {
                localStorage.setItem("token", response.getIdToken().getJwtToken());
                return true;
            }
        } catch(error) {
            return false;
        }

    }
}