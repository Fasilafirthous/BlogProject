import { Box, Button, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { CONFIRM_USER, RESEND_VERIFICATION_CODE } from "../../../Queries/auth";
import './verifySignUp.css'
import { useLazyQuery, useMutation } from "@apollo/client";
import { RESEND_CODE, VERIFY_USER } from "../graphql/query";
import ToasterWithMessage from "../SharedComponents/Toaster/Toast";
function  Verification() {
  const navigate = useNavigate();
  const location: any = useLocation();
  console.log("location",location)
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setError] = useState({ verificationCode: "" });
  const { success, error } = ToasterWithMessage();

  const [verificationcode] =  useLazyQuery(VERIFY_USER, {
    onCompleted: (data) => {
      const res = data.verifySignUpCode;
      if (res) {
        success("User Registered Sucessfully");
        navigate("/");
      }
    },
    onError: (verificationCodeError) => {
      error(verificationCodeError.message);
    },
  });

  const validateOTP = () => {
    let valid = true;
    const errorsCopy = { ...errors };
    if (verificationCode.length === 0) {
      errorsCopy.verificationCode = "verification code is required";
      valid = false;
    } else {
      errorsCopy.verificationCode = "";
    }
    setError(errorsCopy);
    return valid;
  };

  const handleVerifyOTP = async (e: any) => {
    e?.preventDefault();
    console.log(location,  parseInt(verificationCode).toString())
    if (validateOTP()) {
      verificationcode({
        variables: {
          code: parseInt(verificationCode).toString(),
          email: location.state.email
        },
      });
    }
  };

  const [resendVerificationCode] = useLazyQuery(RESEND_CODE, {
    onCompleted: (data) => {
      const res = data.resendSignUpCode;
      if (res) {
        success( "Resended OTP Sucessfully");
      }
    },
    onError: (resendVerificationCodeError) => {
      error(resendVerificationCodeError.message);
    },
  });

  const handleResendVerificationCode = () => {
    resendVerificationCode({
      variables: {
        email: location.state.email,
      },
    });
  };

  return (
    <div className="verification-container">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" },
        }}
        noValidate
        autoComplete="off"
        className="verification"
      >
 <Typography sx={{marginBottom: "10%", fontFamily: "monospace" , color: "black"}} variant="h5" gutterBottom>
          Enter Verification Code
        </Typography>
        <div className="input">
          <MuiOtpInput
           sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: "35px",
                borderColor: "black",
                borderWidth: "2px",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
            "& .MuiInputBase-input": {
              textAlign: "center",
              color: "black", 
              padding: "10px"
            },
          }}
            length={6}
            className="verification-input"
            value={verificationCode}
            onChange={(newValue) => setVerificationCode(newValue)}
            validateChar={(val: string) => !isNaN(Number(val))}
          />
        </div>
        <div>
          <Button
            sx={{
              marginTop: "10px",
              marginLeft: "25%",
              color: "black",
              textTransform: "capitalize",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
              width: "50%",
            }}
            type="submit"
            variant="contained"
            disabled={verificationCode.length !== 6}
            onClick={(e) => handleVerifyOTP(e)}
          >
            Verify
          </Button>
          <Typography variant="body2" align="center" padding={"10px"} color={"black"}>
            Didn't receive code?
            <Typography
              onClick={() => handleResendVerificationCode()}
              variant="body2"
              component="span"
              color="red"
              sx={{
                marginLeft: 1,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Resend code
            </Typography>
          </Typography>
        </div>
      </Box>
    </div>
  );
}

export default Verification;


