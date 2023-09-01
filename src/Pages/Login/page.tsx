"use client";

import { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { api } from "@/services/api/axios";
import { sha512 } from "@/helpers/sha512";
import { UserContext } from "@/context/useUser";
import ModalAdicionarImagens from "./ModalAdicionarImagens";
import { MdLogin } from 'react-icons/md'
export default function CadastroComponent() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [openModalAdicionarImagens,setOpenModalAdicionarImagens] = useState(false)
  const router = useRouter();
  const { setDataUser } = useContext(UserContext)

  function verificarFotosUsuario(usuarioId:number,mensagemAuth:string){
      api.get('imagens/visualizar',{
        params:{usuarioId,paginacao:1}
      }).then((response) =>{
        if(response.data.length > 0){
          toast.success(mensagemAuth)
          router.push('/authFace')
        }else{
          setOpenModalAdicionarImagens(true)
        }
      })
  }
  async function autenticarUsuario() {
    let senhaSha512 = await sha512(password.toUpperCase());
    const objOptions = { username:usuario, senha:senhaSha512 };

    const response = await api.post(
      "usuarios/consultar",
      objOptions
    );
    console.log(response);

    if (response.data.type == "success") {
    const usuarioId = response.data.usuario[0].id
      setDataUser(response.data.usuario[0])
      verificarFotosUsuario(usuarioId,response.data.mensagem)
    }else{
      toast.warn(response.data.mensagem)
    }
  }

  return (
    <>
      <ModalAdicionarImagens 
      openModal={openModalAdicionarImagens}
      setOpenModal={setOpenModalAdicionarImagens}
      />
      <div className={styles.containerContent}>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.containerMain}>
          <div className={styles.containerMain}>
            <div className={styles.content}>
              <Image
                src="/tcc-completpo.jpg"
                width={70}
                height={70}
                alt="Picture of the author"
              />
              <label htmlFor="" className={styles.label}>
                Cadastro
              </label>
              <Input
                name="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite o nome do usuário"
                type="text"
              />
              <Input
                name="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                type="password"
                onKeyDownCapture={(e)=>{
                  if(e.key == 'Enter') document.getElementById("buttonAuth")?.focus()
                }}
              />
              <Button onClick={autenticarUsuario} id='buttonAuth'><MdLogin size={18} /> Autenticar</Button>
              <label htmlFor="" className={styles.labelSingUp}>
                Não possui uma conta?
              </label>
              <label htmlFor="" className={styles.strongLabel}>
                <Link href={"/"}>&nbsp;Cadastre-se</Link>
              </label>
            </div>
          </div>
        </div>
    </div>
    </>
   
  );
}
