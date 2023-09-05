export const status = {
    ERROR: "error",
    LOADING: "loading",
    IDLE: "idle",
    COMPLETE: "complete",
    SUCCESS: "success",
    MESSAGE: {
        ERROR_GENERIC: "There was a failure. Please try refreshing the page.",
        USER: {
            LOGIN_ERROR: "Something went wrong signing in user.",
            PASSWORD_ERROR: "Something went wrong creating password.",
            PASSWORD_SUCCESS: "Successfully created password.",
            PASSCODE_SUCCESS: "Successfully sent code.",
            PASSCODE_ERROR: "Something went wrong sending code."
        },
        PICKS: {
            EDIT_SUCCESS: "Successfully editted picks.",
            ADD_SUCCESS: "Successfully added picks.",
            PASS_SUBMIT_DATE: "Can't submit pass the deadline",
            TOO_MANY_PICKS: (over: any, limit: any) => `You are ${over} pick(s) over the max of ${limit} picks. Change your picks and try again.`,
            NO_PICKS: "Going to need more than that!",
            NOT_ALLOWED: "Oops, looks like you can't do that."
        },
        REMINDERS: {
            SET_SUCCESS: "Successfully set reminder!",
            ALREADY_SET: "Reminder has already been set."
        }
    }
}