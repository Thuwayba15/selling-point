import { ReactNode } from "react";
import { useStyles } from "./style";

const AuthTitle = ({ children }: { children: ReactNode }) => {
  const { styles } = useStyles();
  return <h2 className={styles.cardTitle}>{children}</h2>;
};

export default AuthTitle;
