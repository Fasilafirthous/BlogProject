import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import DOMPurify from 'dompurify';
import './home.css';
import { GET_BLOGS, GET_CURRENT_USER } from '../graphql/query';
import RecommendIcon from '@mui/icons-material/Recommend';
import { green } from '@mui/material/colors';
import ProfilePopover from '../ProfilepopOver/popOver';
import EditProfile from '../EditProfile/editProfile';
import { globalContext } from '../../provider/AppProvider';
import { Link, useNavigate } from 'react-router-dom';



function Home() {
  const { globalState, handleGlobalState } = useContext(globalContext);
  const [tagsArray, setTagsArray] = useState<any[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const { data, loading, error } = useQuery(GET_BLOGS, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      console.log(data.getallBlogs[0]);
    }
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialog,setdialog] = useState(false)
  
  const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate= useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl); 

  const handleOpenEditDialog=()=>{
      setdialog(true);
      handleClose();
  }

  const handleCloseEditDialog=()=>{
    setdialog(false)
  }
   const {data:user} = useQuery(GET_CURRENT_USER,{
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      console.log(data.getCurrentUser);
      handleGlobalState({...globalState,user:data.getCurrentUser})
    }
  })
  console.log("globalState,51",globalState)
  useEffect(() => {
    if (data && data.getallBlogs) {
      const tags = data.getallBlogs.map((blog: any) => {
        const container = document.createElement('div');
        container.innerHTML = DOMPurify.sanitize(blog.blogContent);
        
        const parsedContent: { text: string, images: string[] } = { text: '', images: [] };
  
        // Function to recursively traverse DOM elements
        const traverse = (element: Element) => {
          if (element.tagName.toLowerCase() === 'img') {
            const imgSrc = element.getAttribute('src') || '';
            parsedContent.images.push(imgSrc);
          } else if (element.children.length > 0) {
            for (let i = 0; i < element.children.length; i++) {
              traverse(element.children[i]);
            }
          } else {
            parsedContent.text += DOMPurify.sanitize(element.innerHTML);
          }
        };
  
        // Start traversing from the container
        for (let i = 0; i < container.children.length; i++) {
          traverse(container.children[i]);
        }
  
        return parsedContent;
      });
  
      setTagsArray(tags);
    }
  }, [data]);
  
  console.log("41",tagsArray)
  console.log("52",tagsArray[0]?.images[0])
  const handleLike=(id:string)=>{
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] ? 0 : 1,
    })); 
 }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='homePage'>
      <div className='header'>
        <div className='logo'>
          <img width='100%' src='https://d3d9g7iskvu4zx.cloudfront.net/Images/blogLogo.jpg' alt='Logo' />
        </div>
        <div className='options'>
          <div className='home'>HOME</div>
          <a className='about'>ABOUT</a>
          <a className='contact'>CONTACT</a>
          <Link to='/write'>WRITE</Link>
          <a className='logout'>LOGOUT</a>
        </div>
        <div className='profile'>
          <img className='profile-img' src={user?.getCurrentUser?.profileUrl ?? 'https://d3d9g7iskvu4zx.cloudfront.net/Images/images.jpg'} alt='Profile' onClick={handleClickOpen} />
          <h4>{user?.getCurrentUser?.userName}</h4>
          <ProfilePopover
          anchorEl={anchorEl}
           open={open}
           onClose={handleClose}
           handleOpenEditDialog={handleOpenEditDialog}
         />
         <EditProfile
          open={dialog}
          onClose={handleCloseEditDialog}
          user= {user?.getCurrentUser}
         />
        </div>
      </div>
      <div className='blog'>
        <img className='blog-img' src='https://d3d9g7iskvu4zx.cloudfront.net/Images/Blog.jpg' alt='Blog' />
      </div>
      <div className='contents'>
        {data && data?.getallBlogs && data?.getallBlogs.map((blog: any, index: number) => (
          <div key={blog?.id} className='blog-post'>
            <div className='headers'>
            <h6>{blog?.user?.userName}</h6>
            <h2>{blog?.blogTitle}</h2>
            </div>
              <div className='Image'>
                <img src={tagsArray[index]?.images[0]} alt="Tag Image" />
              </div>
              <div className='bottom-content'>
              <RecommendIcon onClick={()=> handleLike(blog?.id)}  sx={{ color:likes[blog?.id] === 1? 'green' : 'inherit'}} />
                <span>{likes[blog?.id] ?? 0}</span>
              </div>
          </div>
          
        ))}
         
      </div>
    </div>
  );
}

export default Home;
