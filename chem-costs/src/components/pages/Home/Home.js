import styles from './Home.module.css';
import revenue from '../../../img/revenue.png';
import LinkButton from '../../layout/LinkButton/LinkButton';

function Home() {
    return (
        <section className={styles.home_container}>
            <h1>Welcome to <span>Chem Costs</span></h1>
            <p>
                Start managing your chemical engineering projects with ease, right here, right now.
            </p>
            <LinkButton to="/newproject" text="Create New Project" />
            <img src={revenue} alt="Revenue" />
        </section>
    );
}

export default Home;