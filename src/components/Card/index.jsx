import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import {
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export const Card = ({ icon, title, value, isMeta, onMetaChange }) => {
  const [meta, setMeta] = useState("");
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const getMetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/metas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data.data)) {
          setMetas(response.data.data);
        } else {
          console.error("O formato dos dados recebidos não é um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar metas", error.message);
      }
    };

    getMetas();
  }, []);

  const handleMetaChange = (e) => {
    const selectedMeta = e.target.value;
    setMeta(selectedMeta);
    onMetaChange(selectedMeta); // Notifica o componente pai da mudança
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        width: "80%",
        height: "80%",
      }}
    >
      <Icon sx={{ fontSize: 40, marginRight: "16px" }}>{icon}</Icon>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: isMeta ? "60%" : "100%",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#9F9F9F" }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: "32px" }}>
          {isMeta ? `${value}%` : value}
        </Typography>
      </Box>

      {isMeta && (
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "40%",
          }}
        >
          <FormControl fullWidth variant="standard">
            <InputLabel id="meta">Meta</InputLabel>
            <Select
              labelId="meta"
              id="meta_select"
              name="meta"
              label="Meta"
              value={meta}
              onChange={handleMetaChange}
            >
              {metas.map((meta) => (
                <MenuItem key={meta.id} value={meta.valor}>
                  {meta.descricao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      )}
    </Box>
  );
};

export default Card;
