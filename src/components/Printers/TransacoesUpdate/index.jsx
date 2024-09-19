"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import * as styles from "./style";
import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export const TransacoesUpdate = ({ metaId }) => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataTransacao, setDataTransacao] = useState("");
  const [tipo, setTipo] = useState("Receita");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [userId, setUserId] = useState();
  const [idTransacoes, setIdTransacoes] = useState("");
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0]; // Retorna apenas a parte da data no formato 'YYYY-MM-DD'
  }; // Formatando a data para o padrão 'YYYY-MM-DD'

  useEffect(() => {
    const getMeta = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/transacoes/${metaId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("PEGANDO TRANSACÃO ->", response.data.data);
        setDescricao(response.data.data.descricao);
        setValor(response.data.data.valor);
        setDataTransacao(formatDate(response.data.data.data));
        setIdTransacoes(response.data.data.id);
        setUserId(response.data.data.user_id);
        // setAlertMessage({
        //   message: "Categoria buscada com sucesso!",
        //   type: "success",
        // });
      } catch (error) {
        console.error("Erro ao buscar transação", error.message);
        setAlertMessage({
          show: true,
          message: "Erro ao buscar transação",
          type: "error",
        });
      }
    };
    getMeta();
  }, [metaId]); // PEGANDO transaçoes ao carregar

  useEffect(() => {
    const getCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, []); // pegando categorias para poder atualizar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/transacoes/${idTransacoes}`,
        { descricao, valor, data: formatDate(dataTransacao), user_id: userId , categoria_id: categoria , tipo},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertMessage({
        show: true,
        message: "Transação atualizada com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar meta", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao atualizar a transação",
        type: "error",
      });
    }
  }; // enviando dados para atualizar a transação

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <>
      <styles.Form onSubmit={handleSubmit}>
        <Stack gap={1}>
          <styles.h1>Atualizar transação</styles.h1>
          <styles.TextField
            onChange={(e) => setDescricao(e.target.value)}
            id="descricao"
            label="Descricao"
            placeholder={descricao}
            variant="outlined"
            type="text"
            name="descricao"
            required
          />
          <styles.TextField
            onChange={(e) => setValor(e.target.value)}
            id="valor"
            label="Valor"
            placeholder={valor}
            variant="outlined"
            type="text"
            name="valor"
            required
          />
          <styles.TextField
            onChange={(e) => setDataTransacao(e.target.value)}
            id="dataTransacao"
            label="Data"
            placeholder={dataTransacao}
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
        open={alertMessage?.show || false} 
        autoHideDuration={6000}
        onClose={() => setAlertMessage({ ...alertMessage, show: false })}
      >
        <Alert
          onClose={() => setAlertMessage({ ...alertMessage, show: false })}
          severity={alertMessage?.severity} 
          sx={{ width: "100%" }}
        >
          {alertMessage?.message || ""} 
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransacoesUpdate;
