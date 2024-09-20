import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import * as styles from "./style";
import { useState } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export const PrintersCreate = () => {
  const [client, setClient] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [etiquetasInicial, setEtiquetasInicial] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Verificada");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    severity: "",
  });

  // Função para abrir o modal
  const handleOpen = () => setOpen(true);

  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  // Função para formatar o número
  const formatNumber = (value) => {
    if (!value) return value;
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  // Função para remover a formatação e manter o valor numérico
  const removeFormat = (value) => {
    return value.replace(/\./g, "");
  };

  const handleEtiquetasChange = (e) => {
    const rawValue = removeFormat(e.target.value);
    setEtiquetasInicial(rawValue);
  };//Função chamada ao mudar o valor no campo, removendo a formatação antes de armazená-lo no estado.

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/printers",
        {
          client,
          serial_number: serialNumber,
          etiquetas_inicial: etiquetasInicial,
          description,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertMessage({
        show: true,
        message: "Impressora registrada com sucesso!",
        severity: "success",
      });
      handleClose(); // Fecha o modal ao concluir com sucesso
      window.location.reload(); // Atualiza a página
    } catch (error) {
      console.error("Erro ao registrar impressora", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao registrar impressora",
        severity: "error",
      });
    }
  };

  // Estilo do modal
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  return (
    <>
      {/* Botão que abre o modal */}
      <styles.Button color="primary" variant="contained" onClick={handleOpen}>
        Registrar impressora
      </styles.Button>

      {/* Modal contendo o formulário */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Registrar Impressora
          </Typography>
          <styles.Form onSubmit={handleSubmit}>
            <Stack gap={1}>
              <styles.TextField
                onChange={(e) => setClient(e.target.value)}
                id="client"
                label="Cliente"
                variant="outlined"
                type="text"
                name="client"
                required
              />
              <styles.TextField
                onChange={(e) => setSerialNumber(e.target.value)}
                id="serial_number"
                label="Número de Série"
                variant="outlined"
                type="text"
                name="serial_number"
                required
              />
              <styles.TextField
                onChange={handleEtiquetasChange}
                id="etiquetas_inicial"
                label="Etiquetas Inicial"
                variant="outlined"
                type="text"
                name="etiquetas_inicial"
                value={formatNumber(etiquetasInicial)} // Formata o valor
                required
              />
              <styles.TextField
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                label="Descrição"
                variant="outlined"
                type="text"
                name="description"
                required
              />
              <FormControl fullWidth>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status_select"
                  name="status"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="Danificada">Danificada</MenuItem>
                  <MenuItem value="Verificada">Verificada</MenuItem>
                  <MenuItem value="Pronta para Enviar">
                    Pronta para Enviar
                  </MenuItem>
                  <MenuItem value="Enviada">Enviada</MenuItem>
                </Select>
              </FormControl>

              <Stack alignItems={"center"}>
                <styles.Button color="success" type="submit" variant="contained">
                  Enviar
                </styles.Button>
              </Stack>
            </Stack>
          </styles.Form>
        </Box>
      </Modal>

      {/* Snackbar para mensagens de alerta */}
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

export default PrintersCreate;
