import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditProject.module.css';
import Loading from '../../layout/Loading/Loading';
import Message from '../../layout/Message/Message';
import Container from '../../layout/Container/Container';
import ProjectForm from '../../Project/ProjectForm/ProjectForm';
import GeneralInfoCard from '../../Service/GeneralInfoCard/GeneralInfoCard';
import EconomicInfoForm from '../../Service/EconomicInfoForm/EconomicInfoForm';
import EconomicSummaryCard from '../../Service/EconomicSummaryCard/EconomicSummaryCard';

function EditProject() {

    const { id } = useParams();
    const [project, setProject] = useState([]);
    const [generalInfo, setGeneralInfo] = useState({});
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

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
                    setGeneralInfo(data.general_info || {});
                }
            ).catch((error) => console.log('Error fetching project:', error))
        }, 1000);
    }, [id]);

    // Function to handle project edit submission
    function handleEdit( project ) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(
            resp => resp.json()
        ).then(
            (data) => {
                setProject(data);
                setShowProjectForm(!showProjectForm);
                setMessage('Project updated successfully!');
                setType('success');
            }
        ).catch((error) => console.log('Error updating project:', error));
        setMessage('');
        setType('');
    }

    // Function to create economic information
    function createEconomicInfo(economicInfo) {
        // update the project with economic information
        const updatedProject = { ...project };
        
        // reset the message and type
        setMessage('');
        setType('');

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(economicInfo)
        }).then(
            resp => resp.json()
        ).then(
            (data) => {
                setProject(updatedProject);
                setShowServiceForm(!showServiceForm);
                setMessage('Economic information added successfully!');
                setType('success');
            }
        ).catch((error) => console.log('Error creating economic info:', error));
    }
    

    // Function to toggle the project form visibility
    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    // Function to toggle the project form visibility
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    // Check if project has general_info, capex, and product_cost
    const hasEconomicInfo =
        project.general_info &&
        Object.keys(project.general_info).length > 0 &&
        project.capex !== undefined &&
        project.product_cost !== undefined;

    return (
        <>
            {
                project.project_name ? (
                    <div className={styles.project_details}>
                        <Container customClass="column">
                            {console.log('Message value:', message)}
                            {message && <Message type={type} text={message} />}
                            <div className={styles.details_container}>
                                <h1>Project: {project.project_name}</h1>
                                <button className={styles.btn} onClick={toggleProjectForm}>
                                    {showProjectForm ? 'Hide' : 'Edit Project'}
                                </button>
                                {
                                    !showProjectForm ? (
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
                                                <span>Primary KPI:</span> {project.primary_kpi?.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={styles.project_info}>
                                            <h2>Edit Project Details</h2>
                                            <ProjectForm
                                                handleSubmit={handleEdit}
                                                btnText="Finish Edition"
                                                projectData={project}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div className={styles.services_form_container}>
                                <h2>
                                    {hasEconomicInfo
                                        ? 'Update Project Economic Information'
                                        : 'Add Project Economic Information'}
                                </h2>
                                <button className={styles.btn} onClick={toggleServiceForm}>
                                    {showServiceForm
                                        ? 'Hide'
                                        : hasEconomicInfo
                                            ? 'Update Economic Information'
                                            : 'Add Economic Information'}
                                </button>
                                <div className={styles.project_info}>
                                    {
                                        showServiceForm && <EconomicInfoForm 
                                            handleSubmit={createEconomicInfo}
                                            txtBtn={hasEconomicInfo ? "Update Economic Info" : "Save Economic Info"}
                                            projectData={project}
                                        />
                                    }
                                </div>
                            </div>
                            <h2>Economic Information</h2>
                            <Container customClass="start">
                                {!project.general_info || Object.keys(project.general_info).length === 0 ? (
                                    <p>No economic information available.</p>
                                ) : <>
                                    <GeneralInfoCard projectData={project} />
                                    <EconomicSummaryCard projectData={project} />;
                                </>}
                            </Container>
                        </Container>
                    </div>
                ) : (
                    <Loading />
                )
            }
        </>
    );
}

export default EditProject;