import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { useStyles } from "./style";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700"],
  display: "swap",
});

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { styles } = useStyles();
  return (
    <div className={`${inter.className} ${styles.layout}`}>
      <div className={styles.left}>
        <h1 className={styles.brandTitle}>
          Selling
          <br />
          Point
          <span className="dot" />
        </h1>
        <span className={styles.subtitle}>Automated Sales Solution</span>
      </div>
      <div className={styles.right}>{children}</div>
    </div>
  );
};

export default AuthLayout;
