import { ReactNode } from "react";
import { Card } from "antd";
import { useStyles } from "./style";

const AuthCard = ({ children }: { children: ReactNode }) => {
  const { styles } = useStyles();
  return <Card className={styles.card}>{children}</Card>;
};

export default AuthCard;
