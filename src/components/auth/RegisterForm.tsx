import { Form } from "antd";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthTitle from "./AuthTitle";
import AuthLink from "./AuthLink";
import { useStyles } from "./style";

const RegisterForm = () => {
  const { styles } = useStyles();

  return (
    <Form layout="vertical" name="register">
      <AuthTitle>Register</AuthTitle>

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <AuthInput placeholder="Value" />
      </Form.Item>

      <Form.Item
        label="Surname"
        name="surname"
        rules={[{ required: true, message: "Please enter your surname" }]}
      >
        <AuthInput placeholder="Value" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
      >
        <AuthInput placeholder="Value" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}
      >
        <AuthInput type="password" placeholder="Value" />
      </Form.Item>

      <AuthButton type="primary" htmlType="submit" block>
        Register
      </AuthButton>

      <div className={styles.registerNote}>
        Already have an account? <AuthLink href="/login">Login</AuthLink>
      </div>
    </Form>
  );
};

export default RegisterForm;