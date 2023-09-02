'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button } from '@/components/Button';
import { UserContext } from '@/context/useUser';
import { Input } from '@/components/Input';
import { api } from '@/services/api/axios';
import { sha512 } from '@/helpers/sha512';
import { MdLock } from 'react-icons/md';
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
export default function ModalAddPassword({openModal}:ModalAdicionarImagensProps) {
    
    const { dataUser } = React.useContext(UserContext)
    const [password,setPassword] = React.useState('')
    const [openModalCredencials,setOpenModalCredencials] = React.useState(false)
    
   async function autenticarUsuario(){
    let senhaSha512 = await sha512(password.toUpperCase());
    const objOptions = {username:Buffer.from(dataUser.usuario).toString('base64'),password:senhaSha512}

    api.post("usuarios/gerarToken",objOptions).then((response)=>{
      console.log(response)
    //   localStorage.setItem('tokenTCC',response.data.token)
    }).catch((error) => console.log(error))
    .finally(()=>{
      setTimeout(() => {
       window.location.href = '/listaItens'
      }, 3000);
    })
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
          <label id="parent-modal-description" style={{padding:"0.3rem"}}>
            Informe a senha do usuário:
          </label>
             <div style={{marginTop:"0.3rem",marginBottom:"0.3rem"}}>
            <Input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <Button  onClick={autenticarUsuario}> <MdLock size={18} /> Autenticar</Button>
        </Box>
      </Modal>
    </>
     
  );
}