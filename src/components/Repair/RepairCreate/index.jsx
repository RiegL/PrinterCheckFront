import {
  Box,
  Snackbar,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const RepairCreate = () => {
  const [serialNumber, setSerialNumber] = useState(""); // Serial number search field
  const [printer, setPrinter] = useState(null); // Printer data
  const [repairDescription, setRepairDescription] = useState(""); // Repair description
  const [codigo_identificador, setCodigoIdentificador] = useState(""); // Repair description
  const [status, setStatus] = useState(""); // Status of the printerX
  const [etiquetas_inicial, setEtiquetasInicial] = useState("");
  const [etiquetas_revisao, setEtiquetasRevisao] = useState("");
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [user, setUser] = useState({
    id: null,
  });

  // procura pela impressora atraves do serial number
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");

      // Buscando todas as impressoras
      const response = await axios.get("http://localhost:8080/printers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('RESPOTA PARA PEGAR ID',response.data)
      // Filtrando a impressora com base no serial_number
      const printer = response.data.find(
        (printer) => printer.serial_number === serialNumber
      );

      if (printer) {
        setPrinter(printer); // Set printer data
        setStatus(printer.status); // Set initial status
        setEtiquetasInicial(printer.etiquetas_inicial); // Set initial)
        console.log(printer);
      } else {
        setAlertMessage({
          show: true,
          message: "Impressora não encontrada",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar impressoras", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao buscar impressoras",
        severity: "error",
      });
    }
  };

  // Salvar o reparo e
  // TODO  atualiza a lista de printer 
  const handRepair = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/repairs",
        {
          printer_id: printer.id,
          codigo_identificador: codigo_identificador,
          etiquetas_inicial: etiquetas_inicial,
          etiquetas_revisao: etiquetas_revisao, // ajuste conforme necessário
          repair_description: repairDescription,
          user_id: user.id, // ou pegue o ID do usuário autenticado
          status: status
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlertMessage({
        show: true,
        message: "Reparo registrado com sucesso!",
        severity: "success",
      });

      // Resetar campos após sucesso
      setRepairDescription("");
      setCodigoIdentificador("");
      setPrinter(null);
      setSerialNumber("");
      setStatus("");
    } catch (error) {
      console.error("Erro ao registrar reparo", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao registrar reparo",
        severity: "error",
      });
    }
  };


  const handAttPrinter = async (e)=> {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/printers/${printer.id}`,
        { status: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlertMessage({
        show: true,
        message: "Status da impressora atualizado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar status da impressora", error.message);
      setAlertMessage({
        show: true,
        message: "Erro ao atualizar status da impressora",
        severity: "error",
      });
    }
  }


  //pega o user atual
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        window.location.href = "/login";
      });
  }, []);

  return (
    <>
      <h2>Buscar Impressora para Reparo</h2>
      <TextField
        label="Número de Série"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        fullWidth
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>
      {/* If a printer is found, display the repair form */}
      {printer && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          await handRepair(e);  // Espera criar o reparo
          await handAttPrinter(e); // Depois atualiza o status
      }}>
          <h3>Iniciar Reparo para Impressora: {printer.serial_number}</h3>
          <Box mb={2}>
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
          </Box>
          <Box mb={2}>
            {" "}
            {/* Margem inferior de 2 unidades */}
            <TextField
              label="Descrição do Reparo"
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
          <Box mb={2}>
            {" "}
            {/* Margem inferior de 2 unidades */}
            <TextField
              label="Código identificador"
              value={codigo_identificador}
              onChange={(e) => setCodigoIdentificador(e.target.value)}
              fullWidth
            />
          </Box>
          <Box mb={2}>
            {" "}
            {/* Margem inferior de 2 unidades */}
            <TextField
              label="Etiqueta inicial"
              value={etiquetas_inicial}
              disabled
              fullWidth
            />
          </Box>
          <Box mb={2}>
            {" "}
            {/* Margem inferior de 2 unidades */}
            <TextField
              label="Etiqueta revisão"
              value={etiquetas_revisao}
              onChange={(e) => setEtiquetasRevisao(e.target.value)}
              fullWidth
            />
          </Box>
          <Button variant="contained" color="success" type="submit">
            Registrar Reparo
          </Button>
        </form>
      )}

      {/* Snackbar for alerts */}
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

export default RepairCreate;
