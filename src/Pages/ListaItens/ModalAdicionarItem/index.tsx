"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { UserContext } from "@/context/useUser";
import { Input } from "@/components/Input";
import { api } from "@/services/api/axios";
import { MdAddCircle, MdCancel, MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
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

type itensEstoqueType = {
  itemId: number;
  nomeItem: string;
  dataCriacao: string;
  valorItem: string;
  idUsuarioCriador: number;
  nomeUsuarioCriador: string;
};

interface ModaladicionarItensProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  atualizarListagem: (value: itensEstoqueType) => void;
}
export default function ModalAdicionarItem({
  openModal,
  setOpenModal,
  atualizarListagem,
}: ModaladicionarItensProps) {
  const router = useRouter();
  const { dataUser } = React.useContext(UserContext);
  const [nomeItem, setNomeItem] = React.useState("");
  const [valorItem, setValorItem] = React.useState("");
  const [descricao, setDescricao] = React.useState("");
   
  async function adicionarItem() {
    const objOptions = {
      nomeItem,
      valorItem,
      descricao,
      idUsuarioCriador: dataUser.id,
      nomeUsuarioCriador: dataUser.usuario,
    };
    api
      .post("itens/criar", objOptions)
      .then((response) => {
        if (response.data.type == "success") {
          toast.success(response.data.message);
          closeModal();
          atualizarListagem(response.data.item);
        } else {
          toast.warn(response.data.message);
        }
      })
      .catch((error) => console.error(error));
  }

  function closeModal() {
    setDescricao("");
    setValorItem("");
    setNomeItem("");
    setOpenModal(false);
  }

  return (
    <>
      <Modal
        open={openModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title"> Item</h2>
          <div className={styles.containerInput}>
            <label id="parent-modal-description" style={{ padding: "0.3rem" }}>
              Nome:
            </label>
            <div>
              <Input
                type="text"
                value={nomeItem}
                onChange={(e) => setNomeItem(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.containerInput}>
            <label id="parent-modal-description" style={{ padding: "0.3rem" }}>
              Descrição:
            </label>
            <div>
              <Input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.containerInput}>
            <label id="parent-modal-description" style={{ padding: "0.3rem" }}>
              Valor:
            </label>
            <div>
              <Input
                type="number"
                value={valorItem}
                onChange={(e) => setValorItem(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.containerButtons}>
            <Button onClick={closeModal} color="error" variant="contained">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <MdCancel size={18} /> Cancelar
              </div>
            </Button>
            <Button variant="contained" color="primary" onClick={adicionarItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <MdAddCircle size={18} /> Adicionar
              </div>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
