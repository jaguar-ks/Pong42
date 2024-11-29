"use client"
import styles from './InputField.module.css'

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function InputField({ label, type, id, name, value, onChange, error }: InputFieldProps) {

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={ value ?  styles.label : styles.lableNotVisible}>
        {label}
      </label>
      <div className={styles.inputContainer}>
        <input
          type={type}
          placeholder={label}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={ `${styles.input} ${error ? styles.inputError : ''}`}
        />
      </div>
      {error ?  <p className={styles.errorText}>{error}</p> : <p className={styles.noErrorText}>"no error"</p>}
    </div>
  )
}

