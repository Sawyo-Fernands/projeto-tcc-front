"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Id, ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import Webcam from "react-webcam";
import { api } from "@/services/api/axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { Dialog } from "@mui/material";
import { sha512 } from "@/helpers/sha512";
import { UserContext } from "@/context/useUser";
import { MdCameraAlt,MdCheckCircle,MdPersonAdd } from 'react-icons/md';

export default function CadastroComponent() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagensCapturadas, setImagensCapturadas] = useState<string[]>([]);
  const [userId, setUserId] = useState(0);
  const [openLoading, setOpenLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [startCapture, setStartCapture] = useState(false);
  const { openModalCapturaImagens, setOpenModalCapturaImagens, dataUser } = useContext(UserContext)


  const webcamRef = useRef<any>(null);
  const router = useRouter();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  async function cadastrarFaceUsuario() {
    if (imagensCapturadas.length !== 80) {
      return toast.warn(
        "Número de imagens insuficientes para realizar o cadastro!"
      );
    }
    let index = 0;
    setOpenLoading(true);
    for (const img of imagensCapturadas) {
      const responseSavePhoto = await api.post("imagens/criar", {
        imagem: img,
        idUsuario: userId || dataUser.id,
      });

      if (responseSavePhoto.data.type == "success") {
        index += 1;
        setCount(index);
      }

      if (index == imagensCapturadas.length) {
        setOpenLoading(false);
        setCount(0);
        toast.success("Rosto do usuário cadastrado com sucesso!")
        setTimeout(() => {
        router.push("/login");
        }, 100);
      }
    }
  }

  useEffect(() => {
    if (!startCapture) return;

    const interval = setInterval(() => {
      const images = capturarImagem();
      setImagensCapturadas([...imagensCapturadas, ...images]);
    }, 200);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCapture, imagensCapturadas]);

  function capturarImagem() {
    const imageSrc = webcamRef.current.getScreenshot();
    const images = [];

    if (imagensCapturadas.length >= 80) {
      setStartCapture(false);
      toast.info(
        "Número de imagens capturadas atingiu sua capacidade máxima (80)!"
      );
    } else {
      images.push(imageSrc);
    }

    return images;
  }

  async function criarUsuario() {
    if (usuario && email && password) {
      let senha = await sha512(password.toUpperCase());
      const objOptions = { usuario, password: senha, email };
      console.log(objOptions);

      const response = await api.post("usuarios/criar", objOptions);
      console.log(response);

      if (response.data.type == "success") {
        toast.success(response.data.mensagem);
        setOpenModalCapturaImagens(true);
        setUserId(response.data.id);
      } else {
        toast.warn(response.data.mensagem);
      }
    } else {
      toast.warn("Preencha todos os campos!");
    }
  }

  return (
    <>
      <Dialog open={openLoading} maxWidth="md">
        <div style={{ padding: "1rem" }}>
          <span
            style={{
              fontWeight: "bold",
              marginBottom: "0.5rem",
              fontSize: "10pt",
            }}
          >
            Processando Imagens...(
            {`${((count * 100) / imagensCapturadas.length).toFixed(2)}%`})
          </span>
          <ProgressBar
            completed={count}
            bgColor="#24547b"
            maxCompleted={imagensCapturadas.length}
            transitionDuration="1s"
            width="400px"
            customLabel="..."
            labelColor="#24547b"
          />
        </div>
      </Dialog>
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
                <div >
                 <span style={{fontSize:"1.2rem"}}>Cadastro Facial </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop:"-3rem"
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
                <Button onClick={() => setStartCapture(true)}>
                 <MdCameraAlt size={18} /> Capturar Imagem
                </Button>
                <Button onClick={cadastrarFaceUsuario} disabled={startCapture}>
                  <MdCheckCircle size={18} />Finalizar Cadastro
                </Button>
              </div>
            </div>
            <div className={styles.containerImages}>
              {imagensCapturadas.length > 0 &&
                imagensCapturadas.map((img: string, index: number) => (
                  <div className={styles.img} key={index} style={{marginBottom:"1.55rem"}}>
                    <img src={img} alt="" />
                    <span>Captura - {index + 1}</span>
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
                <Button onClick={criarUsuario}><MdPersonAdd size={18} /> Cadastrar</Button>
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
    </>
  );
}
