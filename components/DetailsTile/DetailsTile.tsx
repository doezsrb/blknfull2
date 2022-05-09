import Image from "next/image";
import styles from "./DetailsTile.module.css";
import { DetailsTileIcons } from "enums";

/* Icons */
import HeartOutlined from "public/icons/heart_outlined.svg";
import Height from "public/icons/height.svg";
import Weight from "public/icons/weight.svg";
import Birthday from "public/icons/birthday.svg";

interface DetailsTileProps {
  icon?: DetailsTileIcons;
  label?: string;
  value: string;
  style?: {};
}

const DetailsTile = ({ icon, label, value, style }: DetailsTileProps) => {
  const getSource = (): StaticImageData => {
    switch (icon) {
      case DetailsTileIcons.STATUS:
        return HeartOutlined;
      case DetailsTileIcons.HEIGHT:
        return Height;
      case DetailsTileIcons.WEIGHT:
        return Weight;
      case DetailsTileIcons.BIRTHDAY:
        return Birthday;
      default:
        return HeartOutlined;
    }
  };

  const getLabel = (): string => {
    switch (icon ? icon : label) {
      case DetailsTileIcons.STATUS:
        return "Status";
      case DetailsTileIcons.HEIGHT:
        return "Height";
      case DetailsTileIcons.WEIGHT:
        return "Weight";
      case DetailsTileIcons.BIRTHDAY:
        return "Birthday";
      default:
        return "...";
    }
  };

  return (
    <div className={styles.container} style={{ ...style }}>
      {icon && (
        <div className={styles.iconContainer}>
          <Image
            className={styles.icon}
            width={24}
            height={24}
            src={getSource()}
            alt="icon"
          />
        </div>
      )}
      <div className={styles.content}>
        <p className={styles.label}>{label ? label : getLabel()}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};

export default DetailsTile;
