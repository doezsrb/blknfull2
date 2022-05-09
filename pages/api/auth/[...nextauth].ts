import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
import Providers from "next-auth/providers";
import User from '../../../services/User';


export default NextAuth({
    session:{
        jwt:true,
        maxAge: 30 * 24 * 60 * 60,
    },
    providers:[
        
        Providers.Credentials({
            
            name: 'Credentials',
            credentials: {
              email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
              password: {  label: "Password", type: "password" },
            },
            async authorize(credentials:any, req) {
               
                let register = credentials.register;
                let email = credentials.email;
                let password = credentials.password;

                if(register != 'false'){
                    try{
                        let name = credentials.name;
                        let gender = credentials.gender;
                        const user_instance = new User(email,password,gender,name);
                        await user_instance.checkRegEmail();
                        try{
                            let registeruser_key = await user_instance.register();
                            
                            let user = {
                                email:registeruser_key,
                                name:name,
                                id:registeruser_key,
                            }
                            return user;
                        }catch(e){
                            return null;
                        }
                    }catch(e){
                        return null;
                    }
                }else{
                    try{
                        const user_instance = new User(email,password);
                        
                        var userlogin:any = await user_instance.login();
                        console.log(userlogin);
                        return userlogin;
                    }catch(e){
                    
                        console.error(e);
                        return null;
                    }
                }
              
            }
          })
    ]
})
