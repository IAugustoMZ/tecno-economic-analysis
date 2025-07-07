import Input from '../../Form/Input/Input';
import Select from '../../Form/Select/Select';
import styles from './ProjectForm.module.css';
import SubmitButton from '../../Form/SubmitButton/SubmitButton';

function ProjectForm( { btnText }) {
    return (
        <form className={styles.form}>
            <Input type="text" text="Project Name" name="project_name" placeholder="Insert the new project name"/>
            <Input type="text" text="Project Description" name="project_description" placeholder="Insert the Project Description"/>
            <Input type="number" text="Plant Capacity (ton/year)" name="plant_capacity" placeholder="Insert the Plant Capacity, in ton/year"/>
            <Input type="number" text="Yearly Discount Rate (%)" name="discount_rate" placeholder="Insert the yearly discount rate "/>
            <Input type="number" text="Project Duration (years)" name="project_duration" placeholder="Inser the project duration in years"/>
            <Select name="primary_kpi" text="Select the primary KPI"/>
            <SubmitButton text={btnText} />
        </form>
    );
}

export default ProjectForm;