
export interface signUpField {
    username: string;
    email: string;
    password: string;
}

export interface signInField {
    email: string;
    password: string;
}

export interface verifySignUpField {
    otp: string;
}

export interface updateField{
    username?: string;
    newPassword?: string;
    oldPassword?: string;
}