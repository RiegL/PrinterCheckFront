"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { TextField, Button, Snackbar, Alert, Box } from "@mui/material";
import RepairCreate from "../../../components/Repair/RepairCreate";

export const RepairPage = () => {
  return (
    <>
     <RepairCreate/>
    </>
  );
};

export default RepairPage;
