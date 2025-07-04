import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import Container from '../Container/Container';
import app_logo from '../../../img/app_logo.png';

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Container>
                <Link to="/">
                    <img src={app_logo} alt="Chem Costs Logo" className={styles.logo}/>
                </Link>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/availableprojects">Projects</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/company">Company</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </Container>
        </nav>
    )
}

export default Navbar;