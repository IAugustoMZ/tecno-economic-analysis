import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditProject.module.css';
import Loading from '../../layout/Loading/Loading';
import Container from '../../layout/Container/Container';

function EditProject() {

    const { id } = useParams();
    const [project, setProject] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Fetch project data based on the ID from the URL
    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                resp => resp.json()
            ).then(
                (data) => {
                    setProject(data);
                    console.log(data);
                }
            ).catch((error) => console.log('Error fetching project:', error))
        }, 1000);
    }, [id]);

    // Function to toggle the project form visibility
    function toggleProjectForm() {
        setShowForm(!showForm);
    }


    return (
        <>
            {
                project.project_name ? (
                    <div className={styles.project_details}>
                        <Container  customClass="column">
                            <div className={styles.details_container}>
                                <h1>Project: {project.project_name}</h1>
                                <button className={styles.btn} onClick={toggleProjectForm}>
                                    {showForm ? 'Hide' : 'Edit Project'}
                                </button>
                                {
                                    !showForm ? (
                                        <div className={styles.project_info}>
                                            <h2>Project Information</h2>
                                            <p>
                                                <span>Project Description:</span> {project.project_description}
                                            </p>
                                            <p>
                                                <span>Plant Capacity (t/year):</span> {project.plant_capacity}
                                            </p>
                                            <p>
                                                <span>Discount Rate (%/year):</span> {project.discount_rate}
                                            </p>
                                            <p>
                                                <span>Project Duration (years):</span> {project.project_duration}
                                            </p>
                                            <p>
                                                <span>Primary KPI:</span> {project.primary_kpi.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={styles.project_info}>
                                            <h2>Edit Project Details</h2>
                                            {/* Here you would include the form component to edit the project */}
                                            {/* Example: <ProjectForm project={project} /> */}
                                            <p>Form to edit project details goes here.</p>
                                        </div>
                                    )
                                }
                            </div>
                        </Container>
                    </div>
                ):
                (
                    <Loading />
                )
            }
        </>
    );
}

export default EditProject;