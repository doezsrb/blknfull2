import database,{storage} from '../store/db';
import User from 'services/User';

export default class Messages{
    
    getMessages(user1:string,user2:string):Promise<any>{
        return new Promise((resolve,reject) => {
            var ref = database.ref(`livechat`);
            var query = `${user1}_${user2}`;
            ref.orderByChild("user1_user2").equalTo(query).once('value',(snap,err) => {
                if(err) reject();
                if(snap.exists()){
                    let data = Object.values(snap.val());
                    resolve(data);
                }else{
                    resolve([]);
                }
            });
        });
    }
    
    getInbox(user1:string,refreshInbox:any):Promise<any[]>{
        var first = true;
        
        return new Promise(async (resolve,reject) => {
            /* var userInstance = new User();
            var userData = await userInstance.getUser(user2); */
            var userInstance = new User();
            var query = user1;
            var ref = database.ref(`lastchat`);
            
            ref.orderByChild("userid").equalTo(query).on('value',async (snap,err) => {
                
                if(!first){
                    refreshInbox();
                    return;
                }
                
                if(err) reject(err);
                
                if(snap.exists()){
                    var data = Object.values(snap.val());
                    
                    var users_msgs:any[] = [];
                    

                    for(let _msg of data){
                        let msg:any = _msg;
                        let user = await userInstance.getUser(msg.remoteid);
                        var obj = {
                            id:msg.remoteid,
                            message:msg.message,
                            name:user.name,
                            time:msg.time,
                            profileUrl:user.profileUrl
                        }
                        users_msgs.push(obj);
                    }
                    first = false;
                    resolve(users_msgs);
                }else{
                    first = false;
                    resolve([]);
                }
            })
        });
    }

}