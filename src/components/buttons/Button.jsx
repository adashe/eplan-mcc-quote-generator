import styles from "./Button.module.css";

function Button({ children, onClick, isActive = true }) {
    return (
        <button
            onClick={onClick}
            className={
                isActive ? styles.btn : `${styles.btn} ${styles.inactive}`
            }
        >
            {children}
        </button>
    );
}

export default Button;
