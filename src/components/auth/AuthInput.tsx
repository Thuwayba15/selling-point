import { Input } from "antd";
import { useStyles } from "./style";

const AuthInput = (props: React.ComponentProps<typeof Input>) => {
  const { styles } = useStyles();
  return <Input className={styles.input} {...props} />;
};

export default AuthInput;
