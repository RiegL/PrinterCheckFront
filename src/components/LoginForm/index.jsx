"use client";
import { useState } from "react";
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";
import * as styles from "./style";
import sx from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      // console.log("Response:", response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao logar", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao Logar - Por favor, verifique seu email e senha.",
        severity: "error",
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <styles.Form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <styles.TP
            variant="h3"
            color="primary"
            style={{
              display: "flex", 
              alignItems: "center",
              justifyContent: "center"
              
            }}
          >
            PrintersCheck
            <CheckCircleIcon sx={{ marginLeft: "5px" }} fontSize="large" />{" "}
          </styles.TP>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            label="E-mail"
            variant="outlined"
            type="email"
            required
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            label="Senha"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack alignItems={"center"}>
            <styles.Button
              color="primary"
              type="submit"
              variant="contained"
              fullWidth
            >
              Entrar
            </styles.Button>
          </Stack>
          <Stack className={sx.border} alignItems="center">
            <Link href="/register" passHref className={sx.buttonCreate}>
              Criar conta
            </Link>
          </Stack>
        </Stack>
      </styles.Form>
      <Snackbar
        open={alertMessage.show}
        autoHideDuration={6000}
        onClose={() => setAlertMessage({ ...alertMessage, show: false })}
      >
        <Alert
          onClose={() => setAlertMessage({ ...alertMessage, show: false })}
          severity={alertMessage.severity}
          sx={{ width: "100%" }}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
