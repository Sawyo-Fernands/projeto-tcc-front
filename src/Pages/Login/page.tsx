"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import axios from "axios";
import Webcam from "react-webcam";

export default function CadastroComponent() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  async function autenticarUsuario() {
    const objOptions = { username:usuario, senha:password };

    const response = await axios.post(
      "http://localhost:5000/usuarios/consultarr",
      objOptions
    );
    console.log(response);

    if (response.data.type == "success") {
      toast.success(response.data.mensagem)
    }else{
      toast.warn(response.data.mensagem)
    }
  }



  return (
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
              />
              <Button onClick={autenticarUsuario}>Cadastrar</Button>
              <label htmlFor="" className={styles.labelSingUp}>
                Não possui uma conta?
              </label>
              <label htmlFor="" className={styles.strongLabel}>
                <Link href={"/login"}>&nbsp;Cadastre-se</Link>
              </label>
            </div>
          </div>
        </div>
    </div>
  );
}
