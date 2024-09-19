"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import * as styles from "./style";
import { useEffect, useState } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export const TransacoesCreate = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataTransacao, setDataTransacao] = useState("");
  const [tipo, setTipo] = useState('Receita');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const getCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/categorias",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("PEGANDO CATEGORIAS ->", response.data.data);

        // Verifique se response.data.data é um array
        if (Array.isArray(response.data.data)) {
          setCategorias(response.data.data);
        } else {
          console.error("Dados recebidos não são um array", response.data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias", error.message);
        setAlertMessage({
          show: true,
          message: "Erro ao buscar categorias",
          severity: "error",
        });
      }
    };
    getCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      descricao,
      valor,
      data: dataTransacao,
      tipo,
      categoria_id: categoria,
    }); // Adicione este log para verificar os dados enviados
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/transacoes",
        {
          descricao,
          valor,
          data: dataTransacao,
          tipo,
          categoria_id: categoria,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertMessage({
        show: true,
        message: "Transação realizada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao realizar uma transação", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao realizar transação",
        severity: "error",
      });
    }
  };

  return (
    <>
      <styles.Form onSubmit={handleSubmit}>
        <Stack gap={1}>
          <styles.h1>Realizar transação</styles.h1>
          <styles.TextField
            onChange={(e) => setDescricao(e.target.value)}
            id="descricao"
            label="Descricao"
            variant="outlined"
            type="text"
            name="descricao"
            required
          />
          <styles.TextField
            onChange={(e) => setValor(e.target.value)}
            id="valor"
            label="Valor"
            variant="outlined"
            type="text"
            name="valor"
            required
          />
          <styles.TextField
            onChange={(e) => setDataTransacao(e.target.value)}
            id="dataTransacao"
            label="Data"
            variant="outlined"
            type="text"
            name="dataTransacao"
            required
          />
          <FormControl fullWidth>
            <InputLabel id="tipo">Tipo</InputLabel>
            <Select
              labelId="tipo"
              id="tipo_select"
              name="tipo"
              value={tipo}
              label="Tipo"
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="Despesa">Despesa</MenuItem>
              <MenuItem value="Receita">Receita</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="categoria">Categoria</InputLabel>
            <Select
              labelId="categoria"
              id="categoria_select"
              name="categoria"
              value={categoria}
              label="Categoria"
              onChange={(e) => setCategoria(e.target.value)}
            >
              {Array.isArray(categorias) &&
                categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Stack alignItems={"center"}>
            <styles.Button color="success" type="submit" variant="contained">
              Enviar
            </styles.Button>
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

export default TransacoesCreate;
