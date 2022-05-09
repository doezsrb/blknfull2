import Head from "next/head";
import styles from "styles/Home.module.css";
import { Carousel, FeaturedProfiles } from "components";
import { useEffect, useState } from "react";
import User from "services/User";
import { useSession } from "next-auth/client";



const demoProfiles = [
  {
    name: "Teodosija",
    age: 19,
    isOnline: true,
  },
  {
    name: "Kosana",
    age: 18,
    isOnline: false,
  },
  {
    name: "Milovanka",
    age: 22,
    isOnline: true,
  },
];


const Home = () => {
  const [profiles,setProfiles] = useState<any[]>([]);
  const [session,loading] = useSession();

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
  useEffect(() => {
    if(!loading){
    
    const userInstance = new User();
    const getUsers = async () => {
      var data:any = await userInstance.getUsers();
      var _data:any[] = [];
      var keys = Object.keys(data);
      keys.map(key => {
        if(session?.user?.email == key) return;
        var _obj = {
          id:key,
          name:data[key].name,
          age:data[key].birthday != null ? getAge(data[key].birthday) : '-',
          isOnline:true
        }
        _data.push(_obj);
      });
      setProfiles(_data);
    }
    getUsers();
    }
  },[loading]);
  
  return (
    <div className={styles.container}>
      <Carousel />
      <FeaturedProfiles title="Recommended" profiles={profiles} />
      <FeaturedProfiles title="Popular" profiles={demoProfiles} />
    </div>
  );
};

export default Home;
