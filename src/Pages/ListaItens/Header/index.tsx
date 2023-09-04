
'use client'
import Image from 'next/image'
import styles from './styles.module.scss'
import { Button } from '@mui/material'
import { BiLogOutCircle } from 'react-icons/bi'
import { UserContext } from '@/context/useUser'
import { useContext } from 'react'

export function HeaderListaItens(){
    const { setDataUser,dataUser } = useContext(UserContext)

    function returnLogin(){
        setDataUser({
          email:"",
          id:0,
          usuario:''
        })
        window.location.href = '/login'
      }
      console.log(dataUser)
    return(
        <header className={styles.header}>
        <div className={styles.containerNav}>
        <Image
                  src="/tcc-completpo.jpg"
                  width={55}
                  height={55}
                  alt="Logo tcc"
                />
      <Button variant="contained" color="error" onClick={returnLogin} sx={{cursor:"pointer"}}>
        <div className={styles.containerButton}>
         <BiLogOutCircle size={21} /> Sair
        </div>
      </Button>
  
        </div>
      </header>
    )
}