import styles from "./DetailsTileEdit.module.css";
import { DetailsTileIcons } from "enums";
import { FormEvent } from "react";

interface DetailsTileEditProps {
  label: string;
  value: string;
  id:string;
  style?: {};
  onChange: (val: FormEvent) => void;
}

const DetailsTileEdit = ({
  label,
  value,
  id,
  style,
  onChange,
}: DetailsTileEditProps) => {
  const getLabel = (): string => {
    switch (label) {
      case DetailsTileIcons.HOBBY:
        return "Hobby";
      case DetailsTileIcons.HOROSCOPE_SIGN:
        return "Horoscope sign";
      case DetailsTileIcons.WORK:
        return "Work";
      case DetailsTileIcons.EYE_COLOR:
        return "Eye Color";
      default:
        return "...";
    }
  };

  return (
    <div className={styles.container} style={{ ...style }}>
      <div className={styles.content}>
        <p className={styles.label}>{getLabel()}</p>
        <input
          className={styles.input}
          type="text"
          placeholder={`Add ${getLabel()}`}
          id={id}
          value={value}
          onChange={e => onChange(e)}
        />
      </div>
    </div>
  );
};

export default DetailsTileEdit;
