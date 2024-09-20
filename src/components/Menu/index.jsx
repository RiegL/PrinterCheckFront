"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import { grey } from "@mui/material/colors";
import { Link } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const drawerWidth = 240;

export default function Menu({ children }) {
  const router = useRouter();
  const doLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          "& .MuiPaper-root": {
            background: "#191919",
            color: "#ffffff",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography
          style={{
            marginTop: "48px",
            color: "#299D91",
            fontWeight: "bold",
            marginLeft: "24px",
            display: "flex", // Alinha ícone e texto na horizontal
            alignItems: "center", // Centraliza verticalmente
          }}
          variant="h5"
        >
          PrintersCheck
          <CheckCircleIcon sx={{ marginLeft: "5px" }} />{" "}
          {/* Espaço entre o texto e o ícone */}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List sx={{ flexGrow: 1 }}>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              href="/dashboard"
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#333", // Cor ao passar o mouse
                    },
                    "&:focus": {
                      backgroundColor: "#444", // Cor ao clicar ou focar
                    },
                    "&:active": {
                      backgroundColor: "#555", // Cor ao segurar o clique
                    },
                  }}
                >
                  <ListItemIcon>
                    <GridViewIcon sx={{ color: grey[50] }} />
                  </ListItemIcon>
                  <ListItemText primary="Meu Painel" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link
              style={{ textDecoration: "none", color: "white" }}
              href="/categoria"
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                    "&:focus": {
                      backgroundColor: "#444",
                    },
                    "&:active": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletIcon sx={{ color: grey[50] }} />
                  </ListItemIcon>
                  <ListItemText primary="Categoria" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link
              style={{ textDecoration: "none", color: "white" }}
              href="/printers"
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                    "&:focus": {
                      backgroundColor: "#444",
                    },
                    "&:active": {
                      backgroundColor: "#555",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LocalPrintshopIcon sx={{ color: grey[50] }} />
                  </ListItemIcon>
                  <ListItemText primary="Impressoras" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>

          <List>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                  "&:focus": {
                    backgroundColor: "#444",
                  },
                  "&:active": {
                    backgroundColor: "#555",
                  },
                }}
                onClick={doLogout}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: grey[50] }} />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}
