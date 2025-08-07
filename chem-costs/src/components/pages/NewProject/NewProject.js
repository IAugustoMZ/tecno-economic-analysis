import styles from './NewProject.module.css';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../Project/ProjectForm/ProjectForm';

function NewProject() {

    const history = useNavigate();

    async function createProject(project) {

        // Convert numeric fields to float
        project.project_duration = parseFloat(project.project_duration);
        project.discount_rate = parseFloat(project.discount_rate);
        project.plant_capacity = parseFloat(project.plant_capacity);
        
        // Convert primary KPI ID to integer
        project.primary_kpi_id = parseInt(project.primary_kpi.id, 10);
        delete project.primary_kpi;

        console.log('Creating project:', project);

        try {
            const response = await fetch('http://localhost:8000/new-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
            });
            const data = await response.json();
            console.log('Success:', data);

            // Recover the id of the created project if returned by the backend
            const createdProjectId = data.id;
            console.log('Created Project ID:', createdProjectId);
            // redirect
            history('/availableprojects', { state: {message: 'Project created successfully!'}});
        } catch (error) {
            console.error('Error creating project:', error);
        }
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