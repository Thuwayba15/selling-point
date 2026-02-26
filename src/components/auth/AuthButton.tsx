import { Button } from "antd";
import { useStyles } from "./style";

const AuthButton = (props: React.ComponentProps<typeof Button>) => {
  const { styles } = useStyles();
  return <Button className={styles.button} {...props} />;
};

export default AuthButton;
