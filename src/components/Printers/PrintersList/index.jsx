import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

// Função para listar impressoras
export const PrintersList = () => {
  const [printers, setPrinters] = useState([]); // Lista de impressoras
  const [filteredPrinters, setFilteredPrinters] = useState([]); // Lista filtrada de impressoras
  const [statusFilter, setStatusFilter] = useState("Todas"); // Filtro de status
  const [ano, setAno] = useState(""); // Filtro de ano
  const [anos, setAnos] = useState([]); // Lista de anos disponíveis

  useEffect(() => {
    const getPrinters = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/printers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const printersData = response.data;

        setPrinters(printersData);
        setFilteredPrinters(printersData);

        // Extrair anos únicos a partir do campo created_at
        const anosDisponiveis = [
          ...new Set(
            printersData.map((printer) => dayjs(printer.created_at).year())
          ),
        ].sort((a, b) => a - b);

        setAnos(anosDisponiveis); // Definir anos no select
      } catch (error) {
        console.error("Erro ao buscar impressoras", error.message);
      }
    };
    getPrinters();
  }, []); // Carregar todas as impressoras na montagem do componente

  useEffect(() => {
    let filtered = printers;

    // Filtro por status
    if (statusFilter !== "Todas") {
      filtered = filtered.filter((printer) => printer.status === statusFilter);
    }

    // Filtro por ano
    if (ano) {
      filtered = filtered.filter(
        (printer) => dayjs(printer.created_at).year() === parseInt(ano)
      );
    }

    setFilteredPrinters(filtered); // Atualiza a tabela com os filtros aplicados
  }, [statusFilter, ano, printers]);

  const Filter = ({ label, isActive, onClick }) => (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "8px 16px",
        borderBottom: isActive ? "2px solid #299D91" : "none",
        transition: "border-bottom 0.3s",
        color: isActive ? "#299D91" : "inherit",
        fontWeight: isActive ? "bolder" : "normal",
      }}
    >
      {label}
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", gap: 10, margin: "30px 0" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="ano-select-label">Ano</InputLabel>
          <Select
            labelId="ano-select-label"
            id="ano-select"
            value={ano}
            label="Ano"
            onChange={(e) => setAno(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos os anos</em>
            </MenuItem>
            {anos.map((ano) => (
              <MenuItem key={ano} value={ano}>
                {ano}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtros para os status */}
        <Filter
          label="Todas impressoras"
          isActive={statusFilter === "Todas"}
          onClick={() => setStatusFilter("Todas")}
        />
        <Filter
          label="Danificada"
          isActive={statusFilter === "Danificada"}
          onClick={() => setStatusFilter("Danificada")}
        />
        <Filter
          label="Verificada"
          isActive={statusFilter === "Verificada"}
          onClick={() => setStatusFilter("Verificada")}
        />
        <Filter
          label="Pronta para Enviar"
          isActive={statusFilter === "Pronta para Enviar"}
          onClick={() => setStatusFilter("Pronta para Enviar")}
        />
        <Filter
          label="Enviada"
          isActive={statusFilter === "Enviada"}
          onClick={() => setStatusFilter("Enviada")}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{ padding: 5, maxWidth: 1000, boxShadow: 3, borderRadius: 2 }}
      >
        <Table
          sx={{ minWidth: 500 }}
          size="small"
          aria-label="tabela de impressoras"
        >
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Serial Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Etiquetas Inicial
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Data de Criação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredPrinters) && filteredPrinters.length > 0 ? (
              filteredPrinters.map((printer) => (
                <TableRow key={printer.id}>
                  <TableCell>{printer.client}</TableCell>
                  <TableCell>{printer.serial_number}</TableCell>
                  <TableCell>{printer.etiquetas_inicial}</TableCell>
                  <TableCell>{printer.description}</TableCell>
                  <TableCell>{printer.status}</TableCell>
                  <TableCell>
                    {new Date(printer.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum dado disponível
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
