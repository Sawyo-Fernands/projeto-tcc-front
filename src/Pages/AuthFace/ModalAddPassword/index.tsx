"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@/components/Button";
import { UserContext } from "@/context/useUser";
import { Input } from "@/components/Input";
import { api } from "@/services/api/axios";
import { sha512 } from "@/helpers/sha512";
import { MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  pt: 2,
  px: 4,
  pb: 3,
};

interface ModalAdicionarImagensProps {
  openModal: boolean;
  capturarScreenshot: () => string;
  setDisableCam:(value:boolean) => void;
}
export default function ModalAddPassword({
  openModal,
  setDisableCam,
  capturarScreenshot,
}: ModalAdicionarImagensProps) {
  const router = useRouter()
  const fotoUsuario = capturarScreenshot();
  const { dataUser } = React.useContext(UserContext);
  const [password, setPassword] = React.useState("");
  const [openModalCredencials, setOpenModalCredencials] = React.useState(false);

  async function autenticarUsuario() {
    let senhaSha512 = await sha512(password.toUpperCase());
    const objOptions = {
      username: Buffer.from(dataUser.usuario).toString("base64"),
      password: senhaSha512,
    };

    api
      .post("usuarios/gerarToken", objOptions)
      .then((response) => {
        console.log(response);
        if(response.data.type == 'success'){
          setOpenModalCredencials(true);
          localStorage.setItem('tokenTCC',response.data.token)
          setDisableCam(true)

          setTimeout(() => {
            router.push("/listaItens")
          }, 3000);
        }
      })
      .catch((error) => console.log(error))
  
  }

  return (
    <>
      <Modal
        open={openModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          {/* <h2 id="parent-modal-title">ATENÇÃO!</h2> */}
          <label id="parent-modal-description" style={{ padding: "0.3rem" }}>
            Informe a senha do usuário:
          </label>
          <div style={{ marginTop: "0.3rem", marginBottom: "0.3rem" }}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={autenticarUsuario}>
            {" "}
            <MdLock size={18} /> Autenticar
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openModalCredencials}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 700 }}>
          <h2 id="parent-modal-title">DADOS DO USUÁRIO</h2>
          <img
            src={fotoUsuario}
            alt={`fotoUsuario-${dataUser.usuario}`}
            style={{ borderRadius:"0.25rem" }}
          />
          <p id="parent-modal-description" style={{ padding: "0.3rem" }}>
            Nome:{dataUser.usuario}
          </p>
          <p id="parent-modal-description" style={{ padding: "0.3rem" }}>
            Email:{dataUser.email}
          </p>
          <p id="parent-modal-description" style={{ padding: "0.3rem" }}>
            Data Acesso:{" "}
            {new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString()}
          </p>
        </Box>
      </Modal>
    </>
  );
}
