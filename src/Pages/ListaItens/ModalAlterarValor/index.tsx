"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { UserContext } from "@/context/useUser";
import { Input } from "@/components/Input";
import { api } from "@/services/api/axios";
import { MdAddCircle, MdCancel, MdEdit, MdLock, MdPhoto } from "react-icons/md";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import Webcam from "react-webcam";

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

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
type itensEstoqueType = {
  idItem: number;
  nomeItem: string;
  dataCriacao: string;
  valorItem: string;
  idUsuarioCriador: number;
  nomeUsuarioCriador: string;
  descricao:string;
};

interface ModalAlterarValorProps {
  openModal: boolean;
  selectedRow:itensEstoqueType | undefined;
  setOpenModal: (value: boolean) => void;
  listarIntensEstoque: () => void;
}

export default function ModalAlterarValor({
  openModal,
  setOpenModal,
  selectedRow,
  listarIntensEstoque,
}: ModalAlterarValorProps) {

  const webcamRef = React.useRef<any>(null);
  const { dataUser } = React.useContext(UserContext);
  const [ valorItem, setValorItem ] = React.useState('')
  const [openModalWebCam,setOpenModalWebCam] = React.useState(false)

  function alterarValorItem(){
    const params = { 
        itemId:selectedRow?.idItem,
        valorItem:valorItem
     };
    api.post('itens/alterarValor',params)
    .then((response) => {
        if(response.data.type == 'success'){
            toast.success(response.data.mensagem)
            listarIntensEstoque()
            closeModalAll()
        }else{
            toast.warn(response.data.mensagem)
        }
    })
    .catch((error) => console.error(error))
  }

  function verificarFaceUsuario(){
    const imageSrc = webcamRef.current.getScreenshot();

    const objOptions = {
      fotoUsuario:imageSrc,
      idUsuario:dataUser.id
    }

    api.post("usuarios/verificarRosto",objOptions)
    .then((response) =>{
      if(response.data.reconhecido){
        toast.success(response.data.mensagem)
        alterarValorItem()
      }else{
        toast.warn(response.data.mensagem)
      }
    }).catch((error) => console.error(error))
  }

  function closeModal() {
    setValorItem("");
    setOpenModal(false);
  }

  function closeModalAll(){
    closeModal()
    setOpenModalWebCam(false)
  }

  return (
    <>
      <Modal
        open={openModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
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
            <Button variant="contained" color="primary" onClick={()=>setOpenModalWebCam(true)}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <MdEdit size={18} /> Alterar
              </div>
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openModalWebCam}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 750 }}>
        <h2 id="parent-modal-title"> Verificar Face</h2>
        <Webcam
                  ref={webcamRef}
                  audio={false}
                  height={'100%'}
                  screenshotFormat="image/jpeg"
                  width={'100%'}
                  videoConstraints={videoConstraints}
                />

          <div className={styles.containerButtons}>
            <Button onClick={closeModalAll} color="error" variant="contained">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <MdCancel size={18} /> Cancelar
              </div>
            </Button>
            <Button variant="contained" color="primary" onClick={verificarFaceUsuario}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <MdPhoto size={18} /> Verificar
              </div>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
