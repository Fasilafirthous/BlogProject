import { useForm } from "react-hook-form";
import "./signup.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import ShowError from "../SharedComponents/showError/showError";
import { signUpSchema } from "../schema/FormSchema";
import { signUpField } from "../schema/FormSchemaField";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutation";
import ToasterWithMessage from "../SharedComponents/Toaster/Toast";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useRef, useState } from "react";
import { GET_PRESIGNED_URL } from "../graphql/query";
import axios from "axios";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<signUpField>({
    resolver: yupResolver<signUpField>(signUpSchema()),
    mode: "all",
  });
  const { success, error } = ToasterWithMessage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState("");
  const [Oriprofile, setOriProfile] = useState<File>();
  const [showPassword, setShowPassword] = useState(false);
  const [signUp] = useMutation(SIGN_UP, {
    fetchPolicy: "network-only",
    onCompleted: () => {
      let emailId = getValues("email");
      console.log(emailId,"email")
      reset();
      success("Account created sucessfully")
      setTimeout(() => {
        navigate("/verifySignUp", { state: { email: emailId } });
      }, 3000);
    },
    onError: (err) => {
      error(err.message)
    },
  });
  const [GetPresignedUrl] = useLazyQuery(GET_PRESIGNED_URL, {
    onCompleted: (data) => {
      // bulkUpload(data);
      console.log(88, data);
    },
    onError: (err) => {
      if (err?.message !== "Unauthorized") {
        console.log(err.message);
      }
    },
  });
  const handleIconClick = () => {
    document.getElementById("file-input")?.click();
  };
  const onSubmitSignup = async (formData: any) => {
    console.log(formData, "formData");
    console.log("filename", Oriprofile);
    if (Oriprofile) {
      let key = `${Date.now()}_${Oriprofile?.name}`;
      console.log(key, "key");
      const upload = async () => {
        console.log(68);
        const res = await GetPresignedUrl({
          variables: {
            bucketName: "project-blog-bucket",
            key: `Images/${key}`,
          },
        });
        console.log("res", res);
        await axios
          .put(res?.data?.getSignedUrlForUpload, Oriprofile, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then(() => {
            signUp({
              variables: {
                createUserInput: {
                  email: formData.email,
                  password: formData.password,
                  username: formData.username,
                  profileUrl: `https://d3d9g7iskvu4zx.cloudfront.net/Images/${key}`,
                },
              },
            });
          })
          .catch((err: any) => {
            console.log(err);
          });
      };
      upload();
    } else {
      signUp({
        variables: {
          createUserInput: {
            emailId: formData.email,
            password: formData.password,
            userName: formData.username,
          },
        },
      });
    }
  };
  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files, "files");
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      console.log(imageUrl, "image");
      setProfile(imageUrl);
      setOriProfile(event.target.files[0]);
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  return (
    <div className="signUp">
      <form
        className="form"
        onSubmit={handleSubmit(onSubmitSignup)}
        autoComplete="off"
      >
        <h1>Hello!</h1>
        <h4>Please signup to continue</h4>
        {profile ? (
          <img src={profile} className="signup-profile" />
        ) : (
          <PersonOutlineIcon
            onClick={handleIconClick}
            sx={{ width: 50, height: 50 }}
          />
        )}

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImage}
        />
        <input
          {...register("username")}
          onChange={(e) => {
            setValue("username", e.target.value.trim());
          }}
          className="username"
          placeholder="Username"
        />
        {errors?.username?.message && (
          <ShowError errorMessage={errors?.username?.message} />
        )}
        <input
          {...register("email")}
          onChange={(e) => {
            setValue("email", e.target.value.trim());
          }}
          className="email"
          placeholder="Email"
        />
        {errors?.email?.message && (
          <ShowError errorMessage={errors?.email?.message} />
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            onChange={(e) => {
              setValue("password", e.target.value.trim());
            }}
            className="password"
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
        {errors?.password?.message && (
          <ShowError errorMessage={errors?.password?.message} />
        )}
        <button type="submit" className="register">
          Register
        </button>
        <div className="exist">
          Already have an account?{" "}
          <Link to="/" className="signin">
            LogIn
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
