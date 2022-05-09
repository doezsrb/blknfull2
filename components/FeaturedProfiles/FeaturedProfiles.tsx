import Image from "next/image";
import styles from "./FeaturedProfiles.module.css";
import { ProfileCard } from "components";
import arrowIcon from "public/icons/view_more_arrow.svg";

interface FeaturedProfilesProps {
  title: string;
  profiles: any;
}

const FeaturedProfiles = ({
  title = "Recommended",
  profiles,
}: FeaturedProfilesProps) => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.profileCardContainer}>
        {profiles.map((profile: any, index: number) => (
          <ProfileCard key={index} {...profile} />
        ))}
      </div>
      <button
        className={styles.viewMore}
        onClick={() => {
          console.log("view more");
        }}
      >
        <span>View more</span>
        <Image width={60} height={12} src={arrowIcon} alt="arrow" />
      </button>
    </div>
  );
};

export default FeaturedProfiles;
