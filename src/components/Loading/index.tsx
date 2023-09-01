import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '@/components/Button';
import { UserContext } from '@/context/useUser';
import { useRouter } from "next/navigation";
import { CircularProgress } from '@mui/material';

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
}
export default function Loading({openModal}:ModalAdicionarImagensProps) {

  return (
      <Modal
        open={openModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
            <div style={{width:'100%',display:"flex",flexDirection:"column",gap:"0.2rem",justifyContent:"center",alignItems:"center"}}>
                <CircularProgress size={110} />
                <p id="parent-modal-description" style={{padding:"0.3rem"}}>
                    Carregando reconhecimento facial...
                </p>
            </div>
          
        </Box>
      </Modal>
  );
}