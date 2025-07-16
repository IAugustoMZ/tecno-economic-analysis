import styles from '../../Project/ProjectCard/ProjectCard.module.css';

function GeneralInfoCard({ projectData }) {
    return (
        <div className={styles.project_card}>
            <h4>General Information</h4>
            <p><span>Total Equipment Cost:</span> <br></br>USD {projectData.general_info?.total_equipment_cost || 'N/A'} million</p>
            <p><span>Total Utility Cost:</span> <br></br>USD {projectData.general_info?.total_utility_cost || 'N/A'} million / year</p>
            <p><span>Product Selling Price:</span> <br></br>USD {projectData.general_info?.product_selling_price || 'N/A'} / kg</p>
        </div>
    );
}

export default GeneralInfoCard;