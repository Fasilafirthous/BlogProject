import React, { useState, useRef, useEffect, useContext } from 'react';
import './write.css';
import '../home/home.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_PRESIGNED_URL } from '../graphql/query';
import { CREATE_BLOG } from '../graphql/mutation';
import axios from 'axios';
import { globalContext } from '../../provider/AppProvider';
import { Link } from 'react-router-dom';

function WritePage() {
  const {globalState}= useContext(globalContext);
  const [title, setTitle] = useState('');
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [isStoryEmpty, setIsStoryEmpty] = useState(true);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState<string[]>([]);
  const [file, setFile]= useState<File[]>([]);
   const [createBlog]=  useMutation(CREATE_BLOG,{
      onCompleted:()=>{
        <Link to='/home'/>
      },
      onError:(err)=>{
        alert(err);

      }
   })
  const handleChangeTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value);
    if (!event.target.value) {
      event.target.style.height = '80px';
    }
  };
  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    const { scrollHeight, clientHeight } = target;

    if (scrollHeight > clientHeight) {
      target.style.height = `${scrollHeight}px`;
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      console.log("32")
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setFile([...file,event.target.files[0]])
      console.log(event.target.files[0])
      setFileName([...fileName,event.target.files[0].name])
      console.log(event.target.files,"file", imageUrl)
      insertImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  const insertImage = (imageUrl: string) => {
    if (contentEditableRef.current) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'Selected Image';
      img.style.maxWidth = '100%';

      const selection = document.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.collapse(false); // Move the caret to the end of the inserted image
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        contentEditableRef.current.appendChild(img);
      }

      setIsStoryEmpty(contentEditableRef.current.textContent?.trim() === '' && !contentEditableRef.current.querySelector('img'));
    }
  };

  useEffect(() => {
    const handleInput = () => {
      if (contentEditableRef.current) {
        setIsStoryEmpty(contentEditableRef.current.textContent?.trim() === '' && !contentEditableRef.current.querySelector('img'));
      }
    };

    const editableDiv = contentEditableRef.current;
    if (editableDiv) {
      editableDiv.addEventListener('input', handleInput);
      return () => editableDiv.removeEventListener('input', handleInput);
    }
  }, []);
 
 
  const [GetPresignedUrl] = useLazyQuery(GET_PRESIGNED_URL, {
    onCompleted: (data) => {
      // bulkUpload(data);
      console.log(88,data)
    },
    onError: (err) => {
      if(err?.message !== "Unauthorized") {
        console.log(err.message)
      }
    },
  });


  const handleSubmit = async () => {
    let updatedHtmlContent;
    
    console.log(file,"file..........");

    if (contentEditableRef.current) {
      const files:string[] = [];
      const htmlContent = contentEditableRef.current.innerHTML;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      console.log(doc, 111);
  
      // Find the image tag and update its src attribute
      const imgTags = doc.querySelectorAll('img');

      const uploadPromises = fileName.map(async (item,index) => {
        let key = `${Date.now()}_${item}`;
        let contentType =  item?.split('.')?.pop()?.toLowerCase() ?? 'application/octet-stream'
        console.log(contentType)
        console.log(key, 102);
        const res = await GetPresignedUrl({
          variables: {
            bucketName: 'project-blog-bucket',
            key: `Images/${key}`,
          },
        });
        console.log(res?.data?.getSignedUrlForUpload, "response");
        await axios.put(res?.data?.getSignedUrlForUpload, file[index], {
          headers: {
            "Content-Type": `image/${contentType}`
          },
        }).then(() => {
          files.push(`https://d3d9g7iskvu4zx.cloudfront.net/Images/${key}`);
        }).catch((err:any) => {
          console.log(err);
        });
      });

      // // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      console.log("files", files);

      console.log(imgTags[0]?.src, 114);
      imgTags.forEach((img, index) => {
        img.src = files[index];
      });
      console.log(imgTags, 'imgTags');
      const serializer = new XMLSerializer();
      updatedHtmlContent = serializer.serializeToString(doc);

      console.log(updatedHtmlContent, 'updatedHtmlContent');
    }

    console.log("title", title);
    createBlog({
      variables: {
        createBlogInput: {
          blogContent: updatedHtmlContent,  
          blogTitle: title,
        },
      },
    });

    setTitle("");
    setContent("");
  };

  

  const handleInput = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
  };

  
  return (
    <div className='writepage'>
      <div className='header'>
        <div className='logo'><img width='100%' src='https://d3d9g7iskvu4zx.cloudfront.net/Images/blogLogo.jpg' alt="Blog Logo" /></div>
        <div className='profile'>
          <button className='publish' onClick={handleSubmit}>PUBLISH</button>
          <img className='profile-img' src={globalState.user.profileUrl} alt="Profile" />
          <h6>{globalState?.user.userName}</h6>
        </div>
      </div>
      <div className='content'>
        <textarea
          className="title"
          value={title}
          onChange={handleChangeTitle}
          onScroll={handleScroll}
          placeholder="Type your title here..."
        />
        <div className="story-container">
        <button onClick={triggerFileInput} className='upload-container'><img src='https://d3d9g7iskvu4zx.cloudfront.net/Images/upload.png' className='upload'/></button>
        <div
          ref={contentEditableRef}
          className={`story ${isStoryEmpty ? 'placeholder' : ''}`}
          onInput={handleInput}
          contentEditable
          data-placeholder="Type your story here..."
        ></div>
        </div>
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}

export default WritePage;
