import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "../Card";
import axios from "axios";
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export const  Panel = () => {
  const [printers, setPrinters] = useState(0);
  const [verificadas, setVerificadas] = useState(0);
  const [danificadas, setDanificadas] = useState(0);
  const [enviadas, setEnviadas] = useState(0);
  const [finalizadas, setFinalizadas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [progressoMeta, setProgressoMeta] = useState(0);

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/printers", {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        setPrinters(response.data.length);
        // Contar status
        setVerificadas(response.data.filter(p => p.status === 'Verificada').length);
        setDanificadas(response.data.filter(p => p.status === 'Danificada').length);
        setEnviadas(response.data.filter(p => p.status === 'Enviada').length);
        setFinalizadas(response.data.filter(p => p.status === 'Pronta para Enviar').length);
        console.log(response.data.status)
      } catch (error) {
        console.error("Erro ao buscar transações", error.message);
      }
    };

    getTransacao();
  }, []);//

  const handleMetaChange = (metaValue) => {
    const metaValueAdjusted = metaValue / 100;
    const progresso = (saldo / metaValueAdjusted) * 100;
    setProgressoMeta(progresso.toFixed(2)); 
  };//mando para a meta em porcentagem


  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
        <Grid item xs={12} sm={6}>
          <Card
            icon={<PrintIcon fontSize="large" sx={{ color: "#299D91" }} />}
            title="Total Impressoras"
            value={printers}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            icon={<FactCheckIcon fontSize="large" sx={{ color: "#299D91" }} />}
            title="Verificadas"
            value={verificadas}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            icon={<CancelIcon fontSize="large" sx={{ color: "red" }} />}
            title="Danificadas"
            value={danificadas}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            icon={<LocalShippingIcon fontSize="large" sx={{ color: "#299D91" }} />}
            title="Enviadas"
            value={enviadas}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            icon={<CheckCircleIcon fontSize="large" sx={{ color: "#299D91" }} />}
            title="Finalizadas"
            value={finalizadas}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* <Card
            icon={<CheckCircleIcon fontSize="large" sx={{ color: "#299D91" }} />}
            title="Metas"
            value={progressoMeta}
            isMeta
            onMetaChange={handleMetaChange}
          /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Panel;
