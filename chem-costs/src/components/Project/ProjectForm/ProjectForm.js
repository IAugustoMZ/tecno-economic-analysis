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
        async function fetchKpis() {
            try {
                const response = await fetch('http://localhost:8000/get-primary-kpis', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setKpis(data.primary_kpis);
                console.log('Fetched KPIs:', data.primary_kpis);
            } catch (error) {
                console.error('Error fetching KPIs:', error);
            }
        }
        fetchKpis();
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
            <Input type="number" text="Project Duration (years)" name="project_duration" placeholder="Insert the project duration in years" onChange={handleChange} value={project.project_duration}/>
            <Input type="number" text="Total Equipment Cost (million USD)" name="total_equipment_cost" placeholder="Insert the total equipment cost in million USD" onChange={handleChange} value={project.total_equipment_cost}/>
            <Input type="number" text="Total Utility Cost (million USD / year)" name="total_utility_cost" placeholder="Insert the total utility cost in million USD per year" onChange={handleChange} value={project.total_utility_cost}/>
            <Input type="number" text="Product Selling Price (USD / kg)" name="product_selling_price" placeholder="Insert the product selling price in USD / kg" onChange={handleChange} value={project.product_selling_price}/>
            <Select name="primary_kpi" text="Select the primary KPI" options={kpis} onChange={handleKpiChange} value={project.primary_kpi?.id }/>
            <SubmitButton text={btnText} />
        </form>
    );
}

export default ProjectForm;