import Link from "next/link";
import { useStyles } from "./style";

const AuthLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const { styles } = useStyles();
  return (
    <Link className={styles.link} href={href}>
      {children}
    </Link>
  );
};

export default AuthLink;
