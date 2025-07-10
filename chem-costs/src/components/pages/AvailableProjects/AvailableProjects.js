import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Message from "../../layout/Message/Message";
import styles from './AvailableProjects.module.css';
import Container from "../../layout/Container/Container";
import LinkButton from "../../layout/LinkButton/LinkButton";
import ProjectCard from "../../Project/ProjectCard/ProjectCard";

function AvailableProjects() {
  const location = useLocation();
  let message = '';
  if (location.state) {
    message = location.state.message;
  }

  const [projects, setProjects] = useState([]);

  // Fetch projects from an API or local storage
  useEffect(() => {
    fetch('http://localhost:5000/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProjects(data);
    }).catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Available Projects</h1>
        <LinkButton to="/newproject" text="Create New Project" />
      </div>
      { message && <Message type="success" text={message} /> }
      <Container customClass="start">
        {projects.length > 0 && projects.map((project) => (
          <ProjectCard
            projectName={project.project_name}
            projectDescription={project.project_description}
            plantCapacity={project.plant_capacity}
            primaryKPI={project.primary_kpi.name}
            id={project.id}
            key={project.id}
          />
        ))}
        {projects.length === 0 && <p>No projects available</p>}
      </Container>
    </div>
    
  );
}

export default AvailableProjects;