import { useState, useEffect, useContext, useRef, createRef } from "react";
import Image from "next/image";
import styles from "styles/Chat.module.css";
import ChatDemoPicture from "public/images/chatDemo.png";
import SendIcon from "public/icons/send.svg";
import Picture1 from "public/images/profileDemo1.png";
import Picture2 from "public/images/profileDemo2.png";
import Picture3 from "public/images/profileDemo3.png";
import { Header, FeaturedProfiles, Button, DetailsTile } from "components";
import { ButtonVariants, DetailsTileIcons } from "enums";
import { useRouter } from "next/dist/client/router";
import clsx from "clsx";
import { useSession } from "next-auth/client";
import DefaultErrorPage from 'next/error';
import SocketContext from '../../socketProvider';
import Messages from 'services/Messages';
import User from 'services/User';

const Chat = () => {
  const router = useRouter();
  var quser:any = router.query.quser;
  const [session,loading] = useSession();
  const socket:any = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState("");
  const [error,setError] = useState<boolean>(false);
  const [userId,setUserId] = useState<any>('');
  const [remUserId,setRemUserId] = useState<string>('');
  const [room,setRoom] = useState<string>('');
  const [focusMsgs,setFocusMsgs] = useState<any[]>([]);
  const [inboxUsers,setInboxUsers] = useState<any[]>([]);
  const [filteredInboxUsers, setFilteredInboxUsers] = useState<any[]>([]);
  const [selectedUser,setSelectedUser] = useState<any>('');
  const refs = useRef<any>([]) 
  const messagesInstance = new Messages();
  const userInstance = new User();
  const getTime = (date:Date) => {
    return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
  }
  const changeFocusMsg = (obj:any) => {

    setRemUserId(obj.id);   
    setSelectedUser(obj);
    for(let key in refs.current){
      refs.current[key].style.opacity = 1;
    }
    refs.current[obj.id].style.opacity = 0.5;
  }
  const setRoomName = () => {
    var room = userId > remUserId ? userId+"|"+remUserId : remUserId+"|"+userId;
    setRoom(room);
    socket.emit('join',room,userId); 
  }

  const getMessages = async () => {
      messagesInstance.getMessages(userId,remUserId).then(res => {
        var data = res;
        var oldMsgs:any[] = [];
        var sortedData = data.sort(function(a:any,b:any){
          var date1:any = new Date(a.time);
          var date2:any = new Date(b.time);
          return date1-date2;
        });
        sortedData.map((msg:any) => {
          var _msg = {
            msg:msg.message,
            senderid:msg.sender_id,
            time:getTime(new Date(msg.time))
          }
          oldMsgs.push(_msg)
         
        });
        setFocusMsgs(oldMsgs);
      }).catch(e => console.log("ERROR FETCH MSGS"));
  }
  const fetchRemUser = async (allMessagesInbox:any,reversed:any) => {
    if(quser != null){
        
      var remUser = allMessagesInbox.find((msg:any,index:any) => {
        if(msg.id == quser){
          return true;
        }
      });
      
      
      if(remUser != undefined){
        let _obj = {
          id:remUser.id,
          name:remUser.name,
          img:remUser.img
        }
        setSelectedUser(_obj);
      }else{
        userInstance.getUser(quser).then(async(res) => {
          var fetchUser = res;
          if(fetchUser != null){
            var _obj:any = {
              id:quser,
              name:fetchUser.name
            }
            var ulrs:any = await userInstance.getImages([quser.profileUrl.small]);
            if(ulrs.length == 0 && ulrs == 'Error Fetch'){
              _obj.img = null;
            }else{
              var staticProfileImgUrl:StaticImageData = {
                src:ulrs[0],
                width:155,
                height:155,
              }
              _obj.img = staticProfileImgUrl;
            }
            
            setSelectedUser(_obj);
          }
        }).catch(e => console.log("ERROR FETCH REM USER"));
        
      }
     
      quser = null;
      
    }else{
      setSelectedUser({id:reversed[0].id,name:reversed[0].name,img:reversed[0].img});
      setRemUserId(reversed[0].id);
    }
  }
  const getInbox = async () => {

      var allMessagesInbox:any[] = [];
      messagesInstance.getInbox(userId,getInbox).then(async(res) => {
        var data:any[] = res;
        var sortedData = data.sort(function(a:any,b:any){
          var date1:any = new Date(a.time);
          var date2:any = new Date(b.time);
          return date1-date2;
        });
        for(let msg of sortedData){
          var _obj:any = {
            id:msg.id,
            message:msg.message,
            name: msg.name,
            time:getTime(new Date(msg.time))
          }

          if(msg.profileUrl != null){
              var urls:any = await userInstance.getImages([msg.profileUrl.small]);
              if(urls.length == 0 || urls == 'Error Fetch'){
                _obj.img = null
              }else{
                var staticProfileImgUrl:StaticImageData = {
                  src:urls[0],
                  width:155,
                  height:155,
                }
                _obj.img = staticProfileImgUrl
              }
               
              allMessagesInbox.push(_obj);
          }else{  
            allMessagesInbox.push(_obj);
          }
      }
      var reversed = allMessagesInbox.reverse();
      fetchRemUser(allMessagesInbox,reversed);
      setInboxUsers(reversed);
      setFilteredInboxUsers(reversed);
      }).catch(e => console.log("ERROR FETCH INBOX"));
  }

  useEffect(() => {
    
    if(filteredInboxUsers.length != 0 && selectedUser != ''){
      if(refs.current[selectedUser.id] != null){
        for(let key in refs.current){
          if(refs.current[key] != null){
            refs.current[key].style.opacity = 1;
          }
        }
        refs.current[selectedUser.id].style.opacity = 0.5;
      } 
    }
  },[filteredInboxUsers]);

  useEffect(()=>{
    if(userId != '' && remUserId != ''){
      setRoomName();
    } 
    getMessages();
    
  },[remUserId]);

  useEffect(() => {
    if(userId != ''){
      
      getInbox();
    }
  },[userId]);

  useEffect(() => {
    
    if(!loading){
      if(session != null){
        setUserId(session.user?.email?.toString());
        if(session.user?.email?.toString() != quser){
          setRemUserId(quser);
        }
        socket.on('livechat',(msg:any) => {
      
          var _msg = {
            msg:msg.msg,
            senderid:msg.userid,
            time:getTime(new Date(msg.time))
          }
          
          setFocusMsgs(old => [...old,_msg]);
        })
        
      }else{
        setError(true);
      }
    }
  },[loading]);

 
  const changeSearch = (e:any) => {
    var filter = e.target.value;
    var data = inboxUsers;
    var filteredData = data.filter(msg => {
      var name = msg.name.toLowerCase();
      filter = filter.toLowerCase();
      return name.startsWith(filter);
    });
    setFilteredInboxUsers(filteredData);
  }
  const sendMsg = () => {
    socket.emit('livechat',newMessage,userId,remUserId,room);
    setNewMessage('');
    //refresh worker...
  }
  const showInbox = () => {
    return true;
  };

  const isOnline = true;

  if(error){
    return <>
      <DefaultErrorPage statusCode={404} />
    </>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.chatPageContainer}>
        <div
          className={clsx(styles.leftSide, {
            [styles.show]: showInbox(),
            [styles.hidden]: !showInbox(),
          })}
        >
          <h1 className={styles.h1}>Inbox</h1>
          <input
            type="text"
            
            onChange={e => changeSearch(e)}
            className={styles.search}
            placeholder="Search here"
          />
          <div className={styles.allChatsWrapper}>
            {filteredInboxUsers.map((user:any,index) => (
              <div
                ref={el => refs.current[user.id] = el}
                
                key={'_'+index}
                className={styles.singleChatWrapper}
                onClick={() => {
                  changeFocusMsg({id:user.id,name:user.name,img:user.img});
                }}
              >
                <div className={styles.singleChatLeft}>
                  <div className={styles.profilePictureOutside}>
                    <Image
                      layout="fixed"
                      // placeholder="blur"
                      width={38}
                      height={38}
                      src={user.img == null ? ChatDemoPicture: user.img}
                      alt="profile picture"
                    />
                  </div>
                  <div className={styles.nameAndLastMessage}>
                    <p className={styles.name}>{user.name}</p>
                    <p className={styles.lastMessage}>{user.message}</p>
                  </div>
                </div>
                <div className={styles.singleChatRight}>
                  <p className={styles.dateOutside}>{user.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={clsx(styles.rightSide, {
            [styles.show]: !showInbox(),
            [styles.hidden]: showInbox(),
          })}
        >
          <div className={styles.chatInfoWrapper}>
            <div className={styles.chatInfoLeft}>
              <div className={styles.profilePictureOutside}>
                <Image
                  layout="fixed"
                  // placeholder="blur"
                  width={38}
                  height={38}
                  src={selectedUser.img == null ? ChatDemoPicture: selectedUser.img}
                  alt="profile picture"
                />
                {isOnline && <div className={styles.onlineIndicator}></div>}
              </div>
              <div className={styles.nameAndLastMessage}>
                <p className={styles.name}>{selectedUser == '' ? '' : selectedUser.name}</p>
                <p className={styles.lastMessage}>Active Now</p>
              </div>
            </div>
            <div className={styles.chatInfoRight}>
              <p className={styles.premium}>Premium plan</p>
              <p className={styles.daysLeft}>5 days left</p>
            </div>
          </div>
          <div className={styles.chat}>
            <div className={styles.chatInnerContainer}>
              {focusMsgs.map(({ msg,senderid,time}: any,index) => (
                <div
                  key={index}
                  className={
                    senderid != userId ? styles.leftBlock : styles.rightBlock
                  }
                >
                  {senderid != userId && (
                    <div className={styles.profilePictureInside}>
                      <Image
                        layout="fixed"
                        // placeholder="blur"
                        width={26}
                        height={26}
                        src={ChatDemoPicture}
                        alt="profile picture of a sender inside chat"
                      />
                    </div>
                  )}
                  <div className={styles.messagesContainer}>
                  <div
                        
                        className={
                          senderid != userId
                            ? styles.leftMessage
                            : styles.rightMessage
                        }
                      >
                        <p className={styles.messageParagraph}>{msg}</p>
                        <p className={styles.dateParagraph}>{time}</p>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sendContainer}>
              <input
                type="text"
                value={newMessage}
                onChange={({ target: { value } }) => setNewMessage(value)}
                className={styles.sendInput}
                placeholder="Start typing here"
              />
              <button className={styles.sendButton}>
                <div className={styles.iconContainer} onClick={sendMsg}>
                  <Image
                    className={styles.icon}
                    width={24}
                    height={24}
                    src={SendIcon}
                    alt="icon"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
