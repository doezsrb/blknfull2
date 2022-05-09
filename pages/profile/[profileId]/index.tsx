import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "styles/ProfilePage.module.css";
import demoProfilePicture from "public/images/demoProfile.jpg";
import HeartIcon from "public/icons/heart.svg";
import Picture1 from "public/images/profileDemo1.png";
import Picture2 from "public/images/profileDemo2.png";
import Picture3 from "public/images/profileDemo3.png";
import { Header, FeaturedProfiles, Button, DetailsTile } from "components";
import { ButtonVariants, DetailsTileIcons } from "enums";
import Carousel, { Modal, ModalGateway, ViewType } from "react-images";
import { useRouter } from "next/dist/client/router";
import { useSession } from 'next-auth/client';
import User from 'services/User';
import DefaultErrorPage from 'next/error';

const lorem = `
Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
when an unknown printer took a galley of type and scrambled it to make a type specimen book.
`;

const pictures = [Picture1, Picture2, Picture3, Picture2, Picture3, Picture1];

/* export const photos = [
  {
    source: "/images/profileDemo1.png",
  },
  {
    source: "/images/profileDemo2.png",
  },
  {
    source: "/images/profileDemo3.png",
  },
  {
    source: "/images/profileDemo2.png",
  },
  {
    source: "/images/profileDemo3.png",
  },
  {
    source: "/images/profileDemo1.png",
  },
]; */

const Profile = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const [session, loading] = useSession();

  const [isOpenImgViewer, setIsOpenImgViewer] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const isOnline = true;
  const [age,setAge] = useState(0);
  const [date,setDate] = useState<string>('-');
  const [user, setUser] = useState<any>({

  });
  const [profileImg,setProfileImg] = useState<any>(demoProfilePicture);
  const [photos,setPhotos] = useState<ViewType[]>([]);
  const [isYourProfile,setIsYourProfile] = useState<boolean>(false);
  const [pictures,setPictures] = useState<StaticImageData[]>([]);
  const [error,setError] = useState<boolean>(false);
  const userInstance = new User();
  useEffect(() => {
    const getDate = (date:any):string => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      let birthDate = new Date(date);
      let year = birthDate.getFullYear();
      let day = birthDate.getDate();
      let month = months[birthDate.getMonth()];
      return `${day} ${month} ${year}`;
    }
    const getAge = (date:any) => {
      var today = new Date();
      var birthDate = new Date(date);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
    }
    const getImages = async (_user:any) => {
      if(_user.imgs == null) return;
        if(_user.imgs.length != 0){
            userInstance.getImages(_user.imgs).then(res => {
              let downloadUrls:string[] = res;
              let _setPhotos:ViewType[] = [];
              let _setPictures:StaticImageData[] = [];
      
              downloadUrls.map(url => {
                _setPhotos.push({
                  source:url
                });
                let staticImgObj:StaticImageData = {
                  src:url,
                  width:155,
                  height:155,
                }
                _setPictures.push(staticImgObj);
              })
              setPhotos(_setPhotos);
              setPictures(_setPictures);
            }).catch(e => console.log("ERROR FETCH IMGS"));
        }
    }
    const getProfileImg = async (_user:any) => {
      if(_user.profileUrl != null){
        
          userInstance.getImages([_user.profileUrl.medium]).then(res => {
            let staticProfileImgUrl:StaticImageData = {
              src:res[0],
              width:155,
              height:155,
            }
            setProfileImg(staticProfileImgUrl);
          }).catch(e => console.log("ERROR FETCH PROFILE IMG"));
          
      
      }
    }
    var attempt = 1;

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
        
        setUser(_user);
        if(_user.birthday != null){
          setAge(getAge(_user.birthday));
          setDate(getDate(_user.birthday));
        }
        getProfileImg(_user);
        getImages(_user);      
      
    }
    if(!loading){
      if(session?.user?.email == profileId){
        setIsYourProfile(true);
      }
      getUser();
    }
  },[loading]);

  if(error){
    return <>
      <DefaultErrorPage statusCode={404} />
    </>
  }
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.firstContainer}>
          <div className={styles.firstLeftContainer}>
            <Image
              className={styles.profilePicture}
              layout="fixed"
              
              width={155}
              height={155}
              src={profileImg}
              alt="profile picture"
            />
            {isOnline && <div className={styles.onlineIndicator}></div>}
            <p className={styles.name}>
              {user.name} <span className={styles.age}>{`(${user.birthday == undefined ? '-' : age})`}</span>
            </p>
          </div>
          {isYourProfile ? (
            <Button
              variant={ButtonVariants.PRIVATE_MESSAGE}
              label="Edit profile"
              onClick={() => {
                router.push(`/profile/${profileId}/edit`);
              }}
            />
          ) : (
            <Button
              variant={ButtonVariants.WITH_ICON}
              icon={HeartIcon}
              label="Add to Favorites"
              onClick={() => {
                console.log("favorites");
              }}
              // style={{alignSelf: "flex-end"}}
            />
          )}
        </div>
        {!isYourProfile ? (
          <div className={styles.actionButtonsContainer}>
            <Button
              variant={ButtonVariants.LIVE_CHAT}
              label="Live Chat"
              onClick={() => {
                console.log("favorites");
              }}
              style={{ width: "30%" }}
            />
            <Button
              variant={ButtonVariants.PRIMARY}
              label="Video Call"
              onClick={() => {
                console.log("favorites");
              }}
              style={{ width: "30%" }}
            />
            <Button
              variant={ButtonVariants.PRIVATE_MESSAGE}
              label="Private Message"
              onClick={() => {
                console.log("favorites");
              }}
              style={{ width: "30%" }}
            />
          </div>
        ) : null}
        <div className={styles.mainProfileDetailsContainer}>
          <div className={styles.detailTileContainer}>
            <DetailsTile icon={DetailsTileIcons.STATUS} value={user.lookingFor != '' && user.lookingFor != null ? user.lookingFor : '-'} />
            <DetailsTile icon={DetailsTileIcons.HEIGHT} value={user.height != '' && user.height != null ? user.height : '-'} />
            <DetailsTile icon={DetailsTileIcons.WEIGHT} value={user.weight != '' && user.weight != null ? user.weight : '-'} />
            <DetailsTile
              icon={DetailsTileIcons.BIRTHDAY}
              value={date}
            />
          </div>
          <p>{user.description}</p>
        </div>
        <div className={styles.picturesContainer}>
          {pictures.map((p: StaticImageData, index: number) => (
            <div key={index} className={styles.picture}>
              <Image
                layout="fixed"
                
                width={225}
                height={225}
                src={p}
                alt={`${user.name}'s picture ${index}`}
                onClick={() => {
                  setCurrImg(index);
                  setIsOpenImgViewer(true);
                }}
              />
            </div>
          ))}
          <ModalGateway>
            {isOpenImgViewer ? (
              <Modal
                onClose={() => {
                  setIsOpenImgViewer(false);
                  setCurrImg(0);
                }}
              >
                <Carousel currentIndex={currImg} views={photos} />
              </Modal>
            ) : null}
          </ModalGateway>
        </div>
        <div className={styles.otherProfileDetailsContainer}>
          <div className={styles.detailTileContainer}>
            <DetailsTile
              label={DetailsTileIcons.HOBBY}
              value={user.hobby != '' && user.hobby != null ? user.hobby : '-'}
              style={{ width: "50%" }}
            />
            <DetailsTile
              label={DetailsTileIcons.HOROSCOPE_SIGN}
              value={user.horoscopeSign != '' && user.horoscopeSign != null ? user.horoscopeSign : '-'}
              style={{ width: "50%" }}
            />
            <DetailsTile
              label={DetailsTileIcons.WORK}
              value={user.work != '' && user.work != null ? user.work : '-'}
              style={{ width: "50%" }}
            />
            <DetailsTile
              label={DetailsTileIcons.EYE_COLOR}
              value={user.eyeColor != '' && user.eyeColor != null ? user.eyeColor : '-'}
              style={{ width: "50%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
