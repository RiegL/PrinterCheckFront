import RegisterForm from "@/components/RegisterForm";
import style from "./style.module.css";
import { Stack } from "@mui/material";
export const RegisterPage = () => {
  return (
    <Stack className={style.container}>
      <Stack >
        <RegisterForm />
      </Stack>
    </Stack>
  );
};

export default RegisterPage;
