"use client";

import { UserContext } from "@/context/useUser";
import { api } from "@/services/api/axios";
import jwt from "jsonwebtoken";
import { useContext } from "react";

export function useGetInfosUser() {
  const { setDataUser } = useContext(UserContext);

  async function getDataUsuario() {
    try {
      const token = localStorage.getItem("tokenTCC") || "";
      // Decodifica o token JWT
      const decoded = jwt.decode(token);
      // O objeto `decoded` conterá o payload do token JWT
      const result = await api.post("usuarios/consultar", {
        username: decoded?.sub,
      });

      const usuario = result.data.usuario;
      setDataUser(usuario[0]);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }

  return { getDataUsuario };
}
