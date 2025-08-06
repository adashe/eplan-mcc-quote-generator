import styles from "./TabNavigation.module.css";

function TabNavigation({ children }) {
    return <div className={styles.tabNav}>{children}</div>;
}

export default TabNavigation;
