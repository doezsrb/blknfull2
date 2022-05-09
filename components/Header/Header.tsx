import Image from "next/image";
import styles from "./Header.module.css";
import logoimg from "public/BalkanDatingLogo.png";
import { Button, Search } from "components";
import { ButtonVariants } from "enums";
import useRedux from "util/useRedux";
import { useContext, useEffect } from "react";
import SocketContext from '../../socketProvider';
import User from 'services/User';
import { useSession } from "next-auth/client";
const Header = () => {
  const { setIsLogin, toggleIsOpenedWrapper } = useRedux();
  const socket:any = useContext(SocketContext);
  const [session, loading] = useSession();
  useEffect(() => {
    
    if(!loading){
      const userInstance = new User();
      userInstance.checkSocket(session,socket);
    }

  },[loading]);
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Image
          className={styles.logo}
          width={30}
          height={30}
          src={logoimg}
          alt="logo"
        />
        <p className={styles.logoText}>balkandating</p>
      </div>
      <Search />
      <div className={styles.loginButtonsContainer}>
        <Button
          variant={ButtonVariants.TEXT}
          label="Login"
          onClick={() => {
            setIsLogin(true);
            toggleIsOpenedWrapper();
          }}
          style={{ marginRight: "40px" }}
        />
        <Button
          variant={ButtonVariants.SECONDARY}
          label="Register here"
          onClick={() => {
            setIsLogin(false);
            toggleIsOpenedWrapper();
          }}
        />
      </div>
    </div>
  );
};

export default Header;
