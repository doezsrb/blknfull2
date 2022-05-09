import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";
import first from "public/images/first.jpg";
import second from "public/images/second.jpg";
import logoimg from "public/BalkanDatingLogo.png";
import { Button } from "components";
import { ButtonVariants } from "enums";
import useRedux from "util/useRedux";
const Carousel = () => {
  const [index, setIndex] = useState(0);
  const { toggleIsOpenedWrapper, setIsLogin } = useRedux();
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((last) => (last === 1 ? 0 : last + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSource = (): StaticImageData => {
    switch (index) {
      case 0:
        return second;
      case 1:
        return first;
      default:
        return first;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dimmer} />
      <Image
        className={styles.heroImage}
        layout="fill"
        placeholder="blur"
        objectFit="cover"
        // priority
        src={getSource()}
        alt="promo picture"
      />
      <div className={styles.content}>
        <h1 className={styles.title}>We make dating easier.</h1>
        <p className={styles.subtitle}>
          Join a network with the people around the Balkan and explore !
        </p>
        <Button
          variant={ButtonVariants.PRIMARY}
          label="Join Now"
          onClick={() => {
            setIsLogin(false);
            toggleIsOpenedWrapper();
          }}
        />
      </div>
      <div className={styles.logo}>
        <Image
          layout="fixed"
          width={200}
          height={195}
          src={logoimg}
          alt="big logo"
        />
      </div>
    </div>
  );
};

export default Carousel;
