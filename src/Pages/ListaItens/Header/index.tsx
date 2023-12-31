"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { BiLogOutCircle } from "react-icons/bi";
import { UserContext } from "@/context/useUser";
import { useContext } from "react";
import { MdPerson } from "react-icons/md";
import { useRouter } from "next/navigation";

export function HeaderListaItens() {
  const { setDataUser, dataUser } = useContext(UserContext);
  const router = useRouter();
  function returnLogin() {
    setDataUser({
      email: "",
      id: 0,
      usuario: "",
    });
    window.location.href = "/login";
  }
  return (
    <header className={styles.header}>
      <div className={styles.containerNav}>
        <Image src="/tcc-completpo.jpg" width={55} height={55} alt="Logo tcc" />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            className={styles.iconDadosCadastrais}
            style={{ padding: "0.3rem" }}
            title="Dados Cadastrais"
            onClick={() => router.push("/dadosCadastrais")}
          >
            <MdPerson size={25} color="white" />
          </div>
          <Button
            variant="contained"
            color="error"
            onClick={returnLogin}
            sx={{ cursor: "pointer" }}
          >
            <div className={styles.containerButton}>
              <BiLogOutCircle size={21} /> Sair
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
