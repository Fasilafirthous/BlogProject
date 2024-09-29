import * as yup from 'yup';
import { signInField, signUpField, updateField, verifySignUpField } from './FormSchemaField';

export const signUpSchema = (): yup.ObjectSchema<signUpField> =>{
    return yup.object().shape({
        username: yup.string().required('*Username is required')
            .min(5, '*Atleast Username has 5 character')
            .matches(
              /^[ A-Za-z0-9_@./#&$+-]*$/,
              '*Required only alphanumerics and Special characters'
            ),
        password:  yup.string().required('*Password is required')
        .min(8, '*Minimum 8 characters are required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
          '*Require 8+ characters, 1 lowercase, 1 uppercase, 1 digit, 1 special.'
        ),
        email: yup.string().required('*Email is required')
        .matches(/^(("[\w-\s]+")|([a-zA-Z]+[\w-]*(?:\.[\w-]+)*)|("[\w-\s]+")([a-zA-Z]+[\w-]*(?:\.[\w-]+)*))(@((?:[a-zA-Z-]+\.)*[a-zA-Z][a-zA-Z-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)/, '*Required valid email id' ),
    });}


export const signInSchema = (): yup.ObjectSchema<signInField> =>{
        return yup.object().shape({
            email: yup.string().required('*Email is required')
            .matches(/^(("[\w-\s]+")|([a-zA-Z]+[\w-]*(?:\.[\w-]+)*)|("[\w-\s]+")([a-zA-Z]+[\w-]*(?:\.[\w-]+)*))(@((?:[a-zA-Z-]+\.)*[a-zA-Z][a-zA-Z-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)/, '*Required valid email id' ),
            password:  yup.string().required('*Password is required')
            .min(8, '*Minimum 8 characters are required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
              '*Require 8+ characters, 1 lowercase, 1 uppercase, 1 digit, 1 special.'
            ),
           
        });}

export const verifySignUpSchema = (): yup.ObjectSchema<verifySignUpField> =>{
  return yup.object().shape({
    otp: yup.string().required('*OTP is required')
    .min(8, '*8 digits are required')
    .matches(/^[0-9]+$/, '*OTP must be a number' )
  })
}

export const editProfileSchema = (
  ispassedwordChange: boolean
): yup.ObjectSchema<updateField> => {
  if (ispassedwordChange) {
    return yup.object().shape({
      username: yup
        .string()
        .required("*Username is required")
        .min(5, "*Atleast Username has 5 character")
        .matches(
          /^[ A-Za-z0-9_@./#&$+-]*$/,
          "*Required only alphanumerics and Special characters"
        ),
      newPassword: yup
        .string()
        .required("*Password is required")
        .min(8, "*Minimum 8 characters are required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
          "*Require 8+ characters, 1 lowercase, 1 uppercase, 1 digit, 1 special."
        ),
      oldPassword: yup
        .string()
    });
  } else {
    return yup.object().shape({
      username: yup
        .string()
        .required("*Username is required")
        .min(5, "*Atleast Username has 5 character")
        .matches(
          /^[ A-Za-z0-9_@./#&$+-]*$/,
          "*Required only alphanumerics and Special characters"
        ),
      newPassword: yup.string(),
      oldPassword: yup.string()
    });
  }
};