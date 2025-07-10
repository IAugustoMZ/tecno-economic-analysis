import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';
import { BsPencil, BsFillTrashFill, BsClipboardDataFill } from 'react-icons/bs';

function ProjectCard({ id, projectName, projectDescription, plantCapacity, primaryKPI, handleRemove }) {
    function getPrimaryKPIKey(primaryKPI) {
        if (primaryKPI.toLowerCase() === 'internal rate of return (irr) - %/year') {
            return 'irr';
        }
        if (primaryKPI.toLowerCase() === 'net present value (npv) - $') {
            return 'npv';
        }
        if (primaryKPI.toLowerCase() === 'payback period - years') {
            return 'pbck';
        }
        if (primaryKPI.toLowerCase() === 'return on investment (roi) - %') {
            return 'roi';
        }
        if (primaryKPI.toLowerCase() === 'levelized cost of product (lcp) - $/kg') {
            return 'lcp';
        }
        return primaryKPI;
    }

    return (
       <div className={styles.project_card}>
            <h4>{projectName}</h4>
            <p>{projectDescription}</p>
            <p>
                <span>Plant Capacity (t / year):</span> {plantCapacity}
            </p>
            <p className={styles.category_text}>
                <span className={`${styles[getPrimaryKPIKey(primaryKPI)]}`}></span> {primaryKPI}
            </p>
            <div className={styles.project_card_actions}>
                <Link to='/'><BsClipboardDataFill/> Details</Link>
                <Link to='/'><BsPencil/> Edit</Link>
                <button><BsFillTrashFill/> Delete</button>
            </div>
       </div>
    );
}

export default ProjectCard;