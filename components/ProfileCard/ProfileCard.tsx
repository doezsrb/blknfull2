import Image from "next/image";
import styles from "./ProfileCard.module.css";
import demoProfile from "public/images/demoProfile.jpg";
import { Button } from "components";
import { ButtonVariants } from "enums";
import { useRouter } from "next/dist/client/router";

interface ProfileCardProps {
  picture?: StaticImageData;
  isOnline?: boolean;
  name: string;
  age: string | number;
  id:string;
}

const ProfileCard = ({
  picture = demoProfile,
  isOnline = false,
  name,
  age,
  id
}: ProfileCardProps) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Image
        className={styles.profilePicture}
        layout="fixed"
        placeholder="blur"
        width={155}
        height={155}
        src={picture}
        alt="profile picture"
      />
      <p className={styles.name}>
        {name} <span>{`(${age})`}</span>
      </p>
      {isOnline && <div className={styles.onlineIndicator}></div>}
      <Button
        variant={ButtonVariants.CHAT_NOW}
        label="Chat Now"
        onClick={() => {
          router.push(`/chat?quser=${id}`);
        }}
      />
    </div>
  );
};

export default ProfileCard;
