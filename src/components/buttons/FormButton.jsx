import styles from "./Button.module.css";

function FormButton({ onClick, isActive = true, children }) {
    return (
        <button
            onClick={onClick}
            className={
                isActive
                    ? styles.formBtn
                    : `${styles.formBtn} ${styles.inactive} ${styles.type}}`
            }
        >
            {children}
        </button>
    );
}

export default FormButton;
