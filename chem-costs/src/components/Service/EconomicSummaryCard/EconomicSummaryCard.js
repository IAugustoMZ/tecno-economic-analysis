import styles from '../../Project/ProjectCard/ProjectCard.module.css';

function EconomicSummaryCard({ projectData }) {
    return (
        <div className={styles.project_card}>
            <h4>Economic Summary</h4>
            <p><span>Net Present Value:</span> <br></br>USD {projectData.cash_flow_info?.npv || 'N/A'}</p>
            <p><span>Internal Rate of Return:</span> <br></br>{projectData.cash_flow_info?.irr || 'N/A'} %</p>
            <p><span>Payback Period</span> <br></br>{projectData.cash_flow_info?.pbck || 'N/A'} years</p>
            <p><span>Return on Investment</span> <br></br>{projectData.cash_flow_info?.roi || 'N/A'} %</p>
            <p><span>Levelized Cost of Product</span> <br></br>USD {projectData.cash_flow_info?.lcp || 'N/A'} / kg</p>
        </div>
    );
}

export default EconomicSummaryCard;