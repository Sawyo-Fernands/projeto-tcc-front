"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { BiLogOut, BiLogOutCircle } from "react-icons/bi";
import { UserContext } from "@/context/useUser";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export function HeaderDadosCadastrais() {
  const { setDataUser, dataUser } = useContext(UserContext);
  const router = useRouter();
  function returnLogin() {
    router.push("/listaItens");
  }
  return (
    <header className={styles.header}>
      <div className={styles.containerNav}>
        <Image src="/tcc-completpo.jpg" width={55} height={55} alt="Logo tcc" />
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={returnLogin}
            sx={{ cursor: "pointer" }}
          >
            <div className={styles.containerButton}>
              <BiLogOut size={21} /> Voltar
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
