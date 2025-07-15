import Input from '../../Form/Input/Input';
import { useEffect, useState } from 'react';
import Select from '../../Form/Select/Select';
import styles from './ProjectForm.module.css';
import SubmitButton from '../../Form/SubmitButton/SubmitButton';

function ProjectForm( { btnText, handleSubmit, projectData } ) {
    const [ kpis, setKpis ] = useState([]);
    const [ project, setProject ] = useState(projectData || {});

    // Fetch primary KPIs from the backend
    // This effect runs once when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/primary_kpis', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },})
        .then((response) => response.json())
        .then((data) => {
            setKpis(data);
        }
        )
        .catch((error) => console.error('Error fetching KPIs:', error));
    }, []);

    // Handle form submission
    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    // Handle input changes
    function handleChange(e) {
        setProject({
            ...project, [e.target.name]: e.target.value
        });
    }

    // handle kpi selection
    function handleKpiChange(e) {
        setProject({
            ...project, primary_kpi: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        });
    }   
    

    return (
        <form className={styles.form} onSubmit={submit}>
            {console.log(project)}
            <Input type="text" text="Project Name" name="project_name" placeholder="Insert the new project name" onChange={handleChange} value={project.project_name}/>
            <Input type="text" text="Project Description" name="project_description" placeholder="Insert the Project Description" onChange={handleChange} value={project.project_description}/>
            <Input type="number" text="Plant Capacity (ton/year)" name="plant_capacity" placeholder="Insert the Plant Capacity, in ton/year" onChange={handleChange} value={project.plant_capacity}/>
            <Input type="number" text="Yearly Discount Rate (%)" name="discount_rate" placeholder="Insert the yearly discount rate " onChange={handleChange} value={project.discount_rate}/>
            <Input type="number" text="Project Duration (years)" name="project_duration" placeholder="Inser the project duration in years" onChange={handleChange} value={project.project_duration}/>
            <Select name="primary_kpi" text="Select the primary KPI" options={kpis} onChange={handleKpiChange} value={project.primary_kpi?.id }/>
            <SubmitButton text={btnText} />
        </form>
    );
}

export default ProjectForm;