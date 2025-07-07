import styles from './NewProject.module.css';
import ProjectForm from '../../Project/ProjectForm/ProjectForm';

function NewProject() {
    return (
        <div className={styles.new_project_container}>
            <h1>New Project</h1>
            <p>Here you can create a new project and then add your equipment.</p>
            <ProjectForm btnText="Create Project"/>
        </div>
    )
}

export default NewProject;