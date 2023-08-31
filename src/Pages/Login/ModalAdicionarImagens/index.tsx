import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '@/components/Button';
import { UserContext } from '@/context/useUser';
import { useRouter } from "next/navigation";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline:'none',
  pt: 2,
  px: 4,
  pb: 3,
};

interface ModalAdicionarImagensProps{
    openModal:boolean;
    setOpenModal:(value:boolean) => void;
}
export default function ModalAdicionarImagens({openModal,setOpenModal}:ModalAdicionarImagensProps) {
    const router = useRouter();
    const { setOpenModalCapturaImagens } = React.useContext(UserContext)


  return (
      <Modal
        open={openModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">ATENÇÃO!</h2>
          <p id="parent-modal-description" style={{padding:"0.3rem"}}>
            Para realizar o login ,é necessário fazer o cadastro de imagens do seu usuário!
          </p>
          <Button  onClick={()=>{
            setOpenModalCapturaImagens(true)
            router.push('/')
          }}>Cadastrar Imagens</Button>
        </Box>
      </Modal>
  );
}