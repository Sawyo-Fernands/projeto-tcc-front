import { InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface InputComponent extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
}

export function Input({ name, ...props }: InputComponent) {
  return (
    <input
      className={styles.input}
      type="text"
      name={name}
      id={name}
      {...props}
    />
  );
}