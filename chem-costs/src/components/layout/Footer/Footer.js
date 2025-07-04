import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';


function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.copyright}>
                <span>Developed by Ícaro Augusto Maccari Zelioli &copy; {new Date().getFullYear()}</span>
            </p>
            <ul className={styles.social_list}>
                <li>
                    <a href="https://www.linkedin.com/in/icaro-augusto-maccari-zelioli/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className={styles.icon} />
                    </a>
                </li>
                <li>
                    <a href="https://github.com/IAugustoMZ" target="_blank" rel="noopener noreferrer">
                        <FaGithub className={styles.icon} />
                    </a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;