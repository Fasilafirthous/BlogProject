import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import './editProfile.css'
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {  editProfileSchema,  } from "../schema/FormSchema";
import { updateField } from "../schema/FormSchemaField";
import ShowError from "../SharedComponents/showError/showError";
import Switch from '@mui/material/Switch';
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../graphql/mutation";
import { GET_PRESIGNED_URL } from "../graphql/query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export interface EditProfileProps {
  open: boolean;
  onClose: () => void;
  user: {
    [key: string]: any;
  };
}


function EditProfile(props: EditProfileProps) {
  const { open, onClose ,user} = props;
  const [profile,setProfile]=useState("");
  const [oriProfile,setOriProfile] = useState<File>();
  const [ispassedwordChange,setIsPasswordChange] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<updateField>({
    resolver: yupResolver<updateField>(editProfileSchema(ispassedwordChange)),
    mode: "all",
  });

  useEffect(() => {
    setProfile(user?.profileUrl);
  }, [user])
 const navigate = useNavigate();
  const [UpdateProfile] = useMutation(UPDATE_PROFILE,{
    onCompleted:(data)=>{
      handleClose();
      console.log(47,ispassedwordChange)
      if(ispassedwordChange){
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken")
        navigate("/");
      }, 500);
    }
    }
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

  useEffect(()=>{
    setValue("username",user?.userName)
  },[user,setValue]);

  console.log(errors,"errors")
  const onSubmit=(formData:any)=>{
    console.log("image",oriProfile, profile)
    console.log(formData,"44")
    if (oriProfile) {
      console.log("changed")
      let key = `${Date.now()}_${oriProfile?.name}`;
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
          .put(res?.data?.getSignedUrlForUpload, oriProfile, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          })
          .then(() => {
            UpdateProfile({
              variables: {
                updateProfile: {
                  id: user?.id,
                  newPassword: formData?.newPassword,
                  username: formData?.username,
                  password: formData?.oldPassword,
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
      if(profile === "fileRemoved"){
        console.log("removed")
      UpdateProfile({
        variables: {
          updateProfile: {
            id: user?.id,
            newPassword: formData?.newPassword,
            username: formData?.username,
            password: formData?.oldPassword,
            profileUrl: null,
          },
        },
      });
     }else{
      console.log("notremoved")
      UpdateProfile({
        variables: {
          updateProfile: {
            id: user?.id,
            newPassword: formData?.newPassword,
            username: formData?.username,
            password: formData?.oldPassword,
            profileUrl: profile,
          },
        },
      });
     }
    }
  }
  
  const handleIconClick = () => {
    document.getElementById("file-input")?.click();
  };
  const handleswitchChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
      console.log(event.target.checked,"switch")
      setIsPasswordChange(event.target.checked)
  }
  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files, "files");
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      console.log(imageUrl, "image");
      setProfile(imageUrl);
      setOriProfile(event.target.files[0]);
    }
  };
  const handleRemoveProfile =()=>{
    setProfile("fileRemoved");
  }

  const handleClose =()=>{
    reset()
    setIsPasswordChange(false);
    setProfile(user?.profileUrl);
    setValue("newPassword","");
    setValue("oldPassword","");
    setValue("username", user?.userName);
    onClose()
  }
  console.log(ispassedwordChange,71,profile,user)
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="editTab">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
        <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ marginTop: "10px" ,fontWeight: 'bold'}}>
          Profile Information
        </DialogTitle>
        <form
        className="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off" >
        <label style={{marginLeft: "5px"}}>Photo</label>

        <div className="profile">
        {
          profile != "fileRemoved"?
          (<img src={profile} className="edit-profile" onClick={handleIconClick}/>):
           <PersonOutlineIcon
          onClick={handleIconClick}
          sx={{ width: 50, height: 50 }}
        />
        }
        <div className="update-remove">
        <label onClick={handleIconClick} style={{color:'green', cursor:'pointer'}}>Update</label>
        <label style={{color:'red', cursor:'pointer'}} onClick={handleRemoveProfile}>Remove</label>
        </div>
          <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImage}
        />
        </div>

        <label style={ { marginLeft:"5px"}}>Username</label>
        <input
          {...register("username")}
          onChange={(e) => {
            setValue("username", e.target.value.trim());
          }}
          className="username-edit"
        />
        {errors?.username?.message && (
          <ShowError errorMessage={errors?.username?.message} />
        )}  
          <label style={ {color: "black"}}>Email</label>

         <input
          className="email-edit"
          defaultValue={user?.email}
          disabled= {true}
        />
         <Switch  onChange={handleswitchChange}/> <label style={ {color: "black"}}>Change Password</label>
         {ispassedwordChange ?
         <div>
          <input  {...register("oldPassword")}
          onChange={(e) => {
            setValue("oldPassword", e.target.value.trim());
          }} className="oldPassword" placeholder="Old password" required/> 
          <input 
          {...register("newPassword")}
          onChange={(e) => {
            setValue("newPassword", e.target.value.trim());
          }}
          className="newPassword" placeholder="New password"/>
            {errors?.newPassword?.message && (
          <ShowError errorMessage={errors?.newPassword?.message} />
        )}  
          </div> : ''
          }

          <div className="bottom-edit">
          <button className="cancel" onClick={onClose} >Cancel</button><button className="submit" >Submit</button>
          </div>
        </form>
        
      </div>
    </Dialog>
  );
}

export default EditProfile;
