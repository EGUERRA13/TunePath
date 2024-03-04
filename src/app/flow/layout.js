import styles from './flow.module.css';
export default function FlowLayout({children}) {
    return (
        <div className={styles.flow}>
            {children}
        </div>
    )
}