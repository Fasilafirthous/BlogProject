import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import { signInField } from "../schema/FormSchemaField";
import { signInSchema } from "../schema/FormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ShowError from "../SharedComponents/showError/showError";
import { IconButton } from "@mui/material";
import { Password, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "../graphql/query";
import ToasterWithMessage from "../SharedComponents/Toaster/Toast";
function SignIn() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<signInField>({
    resolver: yupResolver<signInField>(signInSchema()),
    mode: "all",
  });
  const navigate = useNavigate();
  const { success, error } = ToasterWithMessage();

  const [showPassword,setShowPassword] = useState(false);

   const [login] = useLazyQuery(LOGIN,{
    onCompleted:(data)=>{

      console.log("data",data)
        localStorage.setItem("accessToken", data?.login?.AccessToken);
        localStorage.setItem("refreshToken", data?.login?.RefreshToken);
        setTimeout(() => {
            navigate("/home", { state: { email: getValues("email") } });
          }, 1000);
    },
    onError:(err)=>{
      error(err.message);
    }
   })
  const onSubmitSignIn = (formData: any) => {
    console.log(formData,"formData",41);
    login({
        variables:{
            username: formData.email,
            password: formData.password
        }
    })
    
  };
  const handleClickShowPassword =()=>{
    setShowPassword(!showPassword)
 }
  return (
    <div className="signUp">
      <form className="form" onSubmit={handleSubmit(onSubmitSignIn)} autoComplete="off">   

        <h1>SIGN IN</h1>
        <input
          {...register("email")}
          onChange={(e) => {
            setValue("email", e.target.value.trim());
          }}
          placeholder="Email"
          className="login-email"
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            onChange={(e) => {
              setValue("password", e.target.value.trim());
            }}
            className="login-password"
            placeholder="Password"
          />
          <IconButton
            onClick={handleClickShowPassword}
            edge="end"
            style={{ marginLeft: 8 }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </div>
        <button type="submit" className="login">
          Login
        </button>
        <div className="exist">
          Do you have an account?{" "}
          <Link to="/signup" className="signup">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
