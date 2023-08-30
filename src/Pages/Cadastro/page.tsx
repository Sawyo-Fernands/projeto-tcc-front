"use client";

import { useRef, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openModalCapturaImagens, setOpenModalCapturaImagens] = useState(false);
  const [imagensCapturadas, setImagensCapturadas] = useState<string[]>([]);
  const webcamRef = useRef<any>(null);
  const router = useRouter();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  function verificarDadosUsuario() {
    if (usuario && email && password) {
      setOpenModalCapturaImagens(true);
    } else {
      toast.warn("Preencha todos os campos!");
    }
  }

  async function criarUsuario() {
    if (imagensCapturadas.length !== 80) {
      return toast.warn(
        "Número de imagens insuficientes para realizar o cadastro!"
      );
    }
    const objOptions = { usuario, password, email };

    const response = await axios.post(
      "http://localhost:5000/usuarios/criar",
      objOptions
    );
    console.log(response);

    if (response.data.type == "success") {
      for (const img of imagensCapturadas) {
        const responseSavePhoto = await axios.post(
          "http://localhost:5000/imagens/criar",
          { imagem: img, idUsuario: response.data.id }
        );

        if (responseSavePhoto.data.type == "success") {
          console.log(responseSavePhoto.data.mensagem);
        } else {
          console.log(responseSavePhoto.data.mensagem);
        }
      }
    }
  }

  function capturarImagem() {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imagensCapturadas.length == 80) {
      return toast.info(
        "número de imagens capturadas em sua capacidade máxima(10)!"
      );
    }
    setImagensCapturadas([...imagensCapturadas, imageSrc]);
  }

  console.log(imagensCapturadas);

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
      {openModalCapturaImagens ? (
        <>
          <div className={styles.containerPhoto}>
            <div className={styles.containerTitle}>
              <h3>Cadastro Facial </h3>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2rem",
              }}
            >
              <Button onClick={capturarImagem}>Capturar Imagem</Button>
              <Button onClick={criarUsuario}>Finalizar Cadastro</Button>
            </div>
          </div>
          <div className={styles.containerImages}>
            {imagensCapturadas.length > 0 &&
              imagensCapturadas.map((img: string, index: number) => (
                <div className={styles.img} key={index}>
                  <img src={img} alt="" />
                </div>
              ))}
          </div>
        </>
      ) : (
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
                name="email"
                value={email}
                id="emailInput"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                type="email"
              />
              <Input
                name="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                type="password"
              />
              <Button onClick={verificarDadosUsuario}>Cadastrar</Button>
              <label htmlFor="" className={styles.labelSingUp}>
                Já possui uma conta?
              </label>
              <label htmlFor="" className={styles.strongLabel}>
                <Link href={"/login"}>&nbsp;Faça Login</Link>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
