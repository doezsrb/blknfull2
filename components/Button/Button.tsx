import styles from "./Button.module.css";
import { ButtonVariants } from "enums";
import Image from "next/image";
import chatBubble from "public/icons/chat_bubble.svg";
import { SyntheticEvent } from "hoist-non-react-statics/node_modules/@types/react";

interface ButtonProps {
  variant: ButtonVariants;
  label: string;
  onClick: (e: SyntheticEvent) => void;
  style?: {};
  icon?: StaticImageData;
}

const Button = ({
  variant = ButtonVariants.PRIMARY,
  label,
  onClick,
  style = {},
  icon = chatBubble,
}: ButtonProps) => {
  const renderIcon = () => {
    switch (variant) {
      case ButtonVariants.WITH_ICON: {
        return (
          <div className={styles.icon}>
            <Image width={18} height={18} src={icon} />
          </div>
        );
      }
      case ButtonVariants.CHAT_NOW: {
        return (
          <div className={styles.icon}>
            <Image width={18} height={18} src={chatBubble} />
          </div>
        );
      }
      case ButtonVariants.LIVE_CHAT: {
        return <div className={styles.liveChatIcon} />;
      }
    }

    return null;
  };

  return (
    <button
      style={{ ...style }}
      className={styles[variant]}
      onClick={(e: SyntheticEvent) => onClick(e)}
    >
      {renderIcon()}
      {label}
    </button>
  );
};

export default Button;
