import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./wrapper.module.css";

export interface WrapperProps {
  onClick: () => void;
  className?: string;
  isOpened: boolean;
  children?: ReactNode;
}

const Wrapper = ({ onClick, className, isOpened, children }: WrapperProps) => {
  return (
    <div
      onClick={() => onClick()}
      className={clsx(className, {
        [styles.wrapper]: isOpened,
        [styles.nema]: !isOpened,
      })}
    >
      {children}
    </div>
  );
};

export default Wrapper;
