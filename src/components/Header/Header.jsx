import styles from "./Header.module.css"

export default function Header() {
    return(
        <header>
            <h1 className={styles.title}>Assembly EndGame</h1>
            <p className={styles.description}>Guess the word within 8 attempts to keep the programming world safe from Assembly</p>
        </header>
    )
}