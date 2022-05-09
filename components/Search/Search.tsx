import Image from "next/image";
import styles from "./Search.module.css";
import arrowDown from "public/icons/arrow_down.svg";

const Search = () => {
  return (
    <div className={styles.container}>
      <input type="text" className={styles.input} placeholder="Search here..." />
      <div className={styles.filterButton}>
        <p className={styles.filterText}>18-22</p>
        <Image
          width={12}
          height={12}
          src={arrowDown}
          alt="logo"
        />
      </div>
    </div>
  );
};

export default Search;
