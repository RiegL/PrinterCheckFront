import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const agruparPorStatusEAno = (printers, anoSelecionado) => {
  const resumoStatus = {
    Verificada: 0,
    Danificada: 0,
    "Pronta para Enviar": 0,
    Enviada: 0,
  };

  printers.forEach((printer) => {
    const ano = new Date(printer.created_at).getFullYear();
    if (ano === anoSelecionado && resumoStatus[printer.status] !== undefined) {
      resumoStatus[printer.status] += 1;
    }
  });

  return Object.keys(resumoStatus).map((status) => ({
    status,
    quantidade: resumoStatus[status],
  }));
};

export const Chart = () => {
  const [printersChart, setPrintersChart] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [anosDisponiveis, setAnosDisponiveis] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const getPrinters = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/printers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const printersData = response.data;

        const anos = [
          ...new Set(
            printersData.map((printer) =>
              new Date(printer.created_at).getFullYear()
            )
          ),
        ].sort();
        setAnosDisponiveis(anos);

        const dataset = agruparPorStatusEAno(printersData, anoSelecionado);
        setPrintersChart(dataset);
      } catch (error) {
        console.error("Erro ao buscar impressoras", error.message);
      }
    };
    getPrinters();
  }, [anoSelecionado]);

  const chartSetting = {
    margin: { top: 30, right: 30, bottom: 50 },
    width: windowSize.width * 0.7,
    height: windowSize.height * 0.5,
    sx: {
      [`.${axisClasses.right} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <FormControl
          variant="outlined"
          sx={{ minWidth: 100, marginBottom: 2, marginTop: 4 }}
        >
          <InputLabel id="ano-select-label">Ano</InputLabel>
          <Select
            labelId="ano-select-label"
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            label="Ano"
          >
            {anosDisponiveis.map((ano) => (
              <MenuItem key={ano} value={ano}>
                {ano}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {printersChart.length > 0 ? (
        <BarChart
          dataset={printersChart}
          xAxis={[{ scaleType: "band", dataKey: "status" }]}
          series={[{ dataKey: "quantidade", label: "Quantidade" }]}
          {...chartSetting}
        />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default Chart;
