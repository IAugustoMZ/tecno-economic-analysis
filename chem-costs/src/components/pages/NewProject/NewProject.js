import styles from './NewProject.module.css';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../Project/ProjectForm/ProjectForm';

function NewProject() {

    const history = useNavigate();

    function createProject(project) {
        // initialize the project characteristics
        project.general_info = {};
        project.capex = {};
        project.product_cost = {};
        project.cash_flow_info = {};

        // Send a POST request to the backend to create a new project
        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            // redirect
            history('/availableprojects', { state: {message: 'Project created successfully!'}});
        })
        .catch((error) => {
            console.error('Error creating project:', error);
        });
    }

    return (
        <div className={styles.new_project_container}>
            <h1>New Project</h1>
            <p>Here you can create a new project and then add your equipment.</p>
            <ProjectForm btnText="Create Project" handleSubmit={createProject}/>
        </div>
    )
}

export default NewProject;