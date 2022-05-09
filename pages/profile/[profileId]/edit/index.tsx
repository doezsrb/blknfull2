import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import Image from "next/image";
import styles from "styles/EditProfilePage.module.css";
import demoProfilePicture from "public/images/demoProfile.jpg";
import HeartIcon from "public/icons/heart.svg";
import { Button, DetailsTileEdit, ImagesUpload } from "components";
import { ButtonVariants, DetailsTileIcons } from "enums";
import User from 'services/User';
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/client";
import DefaultErrorPage from 'next/error';
const EditProfile = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { profileId } = router.query;
  const [error,setError] = useState<boolean>(false);
  const userInstance = new User();
  const [initImgs,setInitImgs] = useState<any>([]);
  const [profileImg,setProfileImg] = useState<any>(demoProfilePicture);
  const [obj, setObj] = useState({
    birthday:'',
    name:'',
    lookingFor:'',
    height:'',
    weight:'',
    description:'',
    hobby:'',
    horoscopeSign:'',
    work:'',
    eyeColor:'',
    imgs:[],
    profileImg:[]
  });
  function blobToBase64(blob:any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  useEffect(() => {
    const getProfileImg = async (_user:any) => {
      if(_user.profileUrl != null){
        
          userInstance.getImages([_user.profileUrl.small]).then(res => {
            let staticProfileImgUrl:StaticImageData = {
              src:res[0],
              width:155,
              height:155,
            }
            setProfileImg(staticProfileImgUrl);
          }).catch(e => console.log("ERROR FETCH PROFILE IMG"));

      }
    }
    const getImages = async (_user:any) => {
      if(_user.imgs != null){
          let _imgs = _user.imgs;
          userInstance.getImages(_user.imgs).then(res => {
            let downloadUrls:string[] = res;
            downloadUrls.map((url:string,index) => {
              const xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload =async (event) => {
                const blob = xhr.response;
                var base64 = await blobToBase64(blob);
                var file = new File([blob],url);
                
                let _obj = {
                  dataURL:base64,
                  file:file,
                  url:_imgs[index],
                  downloadUrl:url
                }
                
                setInitImgs((old:any) => [...old,_obj]);
                          
              };
              
              xhr.open('GET', url);
              xhr.send();
          });
          }).catch(e => console.log(e));
      }
    }
    var attempt = 0;
    const getUser = async () => {
        let _user:any = await userInstance.getUser(profileId!.toString());
        if(_user == null){
          const timer = setTimeout(() => {
            if(attempt == 3){
              clearTimeout(timer);
              setError(true);
              return;
            }else{
              console.log("ATTEMPT: "+attempt);
              getUser();
              attempt++;
            }
          },2000); 
          return;
        }
        getProfileImg(_user);
        getImages(_user);
        delete _user['imgs'];
        delete _user['email'];
        delete _user['password'];
        setObj(_user);
      
    }
  
    if(!loading){
      if(session?.user?.email != profileId){
        setError(true);
      }else{
        getUser();
      }
    }
  },[loading])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
   
    let updatedData:any = {...obj};

    if(obj.imgs != null){
      var deletedImgs:any[] = [];
      var uploadedImgs:any[] = [];
      if(obj.imgs.length == 0){
        deletedImgs = initImgs;
      }else{
        initImgs.map((img:any) => {
          if(obj.imgs.filter((e:any) => e.dataURL == img.dataURL).length > 0){
            uploadedImgs.push(img);
          }else{
            deletedImgs.push(img);
          }
        });
      }
      updatedData['imgs4delete'] = deletedImgs;
      updatedData['uploadedImgs'] = uploadedImgs;
     
    }
    

    
    try{
      await userInstance.updateUser(profileId!.toString(),updatedData);
      router.push(`/profile/${profileId}`);
      //alert("Success");
    }catch(e){
      console.log(e);
      //alert("Error");
      router.push(`/profile/${profileId}/edit`);
    }
  };


  const onChangeImg = (uploadImages:any) => {
    var _uploadImages:any = [];
    
    uploadImages.map((file:any) => {
      let _obj = {
        dataURL:file.dataURL,
        type:file.file.type
      }
      _uploadImages.push(_obj);
    })
    setObj(prevData => ({...prevData,imgs:_uploadImages}));

  }

  const onChangeProfileImg = (uploadImages:any) => {
    var _uploadImages:any = [];
    
    uploadImages.map((file:any) => {
      let _obj = {
        dataURL:file.dataURL,
        type:file.file.type
      }
      _uploadImages.push(_obj);
    })
    setObj(prevData => ({...prevData,profileImg:_uploadImages}));
  }
  const onChange = (e: FormEvent) => {
    
    let target:any = e.target;
    let updatedObj:any = {...obj};
    updatedObj[target.id] = target.value;
    setObj(updatedObj);

  }
  
  if(error){
    return <>
      <DefaultErrorPage statusCode={404} />
    </>;
  }
  return (
    <div className={styles.container}>
      <form onSubmit={submit}>
     
        <div className={styles.innerContainer}>
          <div className={styles.upperContainer}>
          
            <div className={styles.profilePictureWrapper}>
              <Image
                className={styles.profilePicture}
                layout="fixed"
                width={140}
                height={140}
                src={profileImg}
                alt="profile picture"
              />
              <ImagesUpload onChangeImg={onChangeProfileImg}  multiple={false} />
            </div>
            
            <div className={styles.upperRightContainer}>
              <Button
                variant={ButtonVariants.SECONDARY}
                label="Save"
                onClick={submit}
              />
              <div className={styles.inputWithText}>
                <p>Your Name</p>
                <input
                  className={styles.input}
                  type="text"
                  name=""
                  id="name"
                  value={obj.name}
                  placeholder="Enter your name here"
                  onChange={e => onChange(e)}
                />
              </div>
            </div>
          </div>
          <div className={styles.sideBySide}>
            <div className={styles.inputWithText}>
              <p>Looking for</p>
              <input
                className={styles.input}
                type="text"
                name=""
                value={obj.lookingFor}
                id="lookingFor"
                placeholder="ex. Relationship"
                onChange={e => onChange(e)}
              />
            </div>
            <div className={styles.inputWithText}>
              <p>Birthday</p>
              <input
                className={styles.input}
                type="date"
                name=""
                value={obj.birthday}
                id="birthday"
                placeholder="DD/MM/YYYY"
                onChange={e => onChange(e)}
              />
            </div>
          </div>
          <div className={styles.sideBySide}>
            <div className={styles.inputWithText}>
              <p>Height</p>
              <input
                className={styles.input}
                type="number"
                name=""
                value={obj.height}
                id="height"
                placeholder="Height in meters"
                onChange={e => onChange(e)}
              />
            </div>
            <div className={styles.inputWithText}>
              <p>Weight</p>
              <input
                className={styles.input}
                type="number"
                name=""
                id="weight"
                value={obj.weight}
                placeholder="Weight in kilograms"
                onChange={e => onChange(e)}
              />
            </div>
          </div>
          <div className={styles.inputWithText}>
            <p>Description</p>
            <textarea
              className={styles.textArea}
              name=""
              id="description"
              placeholder="Type description for your profile here..."
              value={obj.description}
              onChange={e => onChange(e)}
            ></textarea>
          </div>
          <ImagesUpload onChangeImg={onChangeImg} imgs={initImgs} multiple={true}/>
          <div className={styles.detailsTileContainer}>
            <DetailsTileEdit
              id="hobby"
              label={DetailsTileIcons.HOBBY}
              value={obj.hobby}
              onChange={e => onChange(e)}
              // style={{ width: "25%" }}
            />
            <DetailsTileEdit
              label={DetailsTileIcons.HOROSCOPE_SIGN}
              id="horoscopeSign"
              value={obj.horoscopeSign}
              onChange={e => onChange(e)}
              // style={{ width: "25%" }}
            />
            <DetailsTileEdit
              label={DetailsTileIcons.WORK}
              id="work"
              value={obj.work}
              onChange={e => onChange(e)}
              // style={{ width: "25%" }}
            />
            <DetailsTileEdit
              label={DetailsTileIcons.EYE_COLOR}
              id="eyeColor"
              value={obj.eyeColor}
              onChange={e => onChange(e)}
              // style={{ width: "25%" }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
