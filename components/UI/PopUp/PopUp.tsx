import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./PopUp.module.css";
import Image from "next/image";
import x from "public/icons/x.svg";
export interface PopUpProps {
  children: ReactNode;
  className?: string;
  title: string;
  closeClick: () => void;
}

const PopUp = ({ children, className, title, closeClick }: PopUpProps) => {
  return (
    <div className={clsx(className, styles.popUp)}>
      <div className={styles.topFlex}>
        <div className={styles.title}>{title}</div>
        <div className={styles.xClose} onClick={() => closeClick()}>
          <span className={styles.xStyle}></span>
        </div>
      </div>
      <div className={styles.childBox}>{children}</div>
    </div>
  );
};

export default PopUp;
