import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Loading from '../../layout/Loading/Loading'
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
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');

  // Fetch projects from an API or local storage
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://localhost:8000/get-available-projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setProjects(data);
        setRemoveLoading(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProjects();
  }, []);

  // remove projects from the list
  async function removeProject(id) {
    try {
      const response = await fetch(`http://localhost:8000/delete-project/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await response.json();
      setProjects(projects.filter((project) => project.id !== id));
      setProjectMessage('Project removed successfully!');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Available Projects</h1>
        <LinkButton to="/newproject" text="Create New Project" />
      </div>
      { message && <Message type="success" text={message} /> }
      { projectMessage && <Message type="success" text={projectMessage} /> }
      <Container customClass="start">
        {projects.length > 0 && projects.map((project) => (
          <ProjectCard
            projectName={project.project_name}
            projectDescription={project.project_description}
            plantCapacity={project.plant_capacity}
            primaryKPI={project.primary_kpi.name}
            id={project.id}
            key={project.id}
            handleRemove={removeProject}
          />
        ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <Message type="warning" text="No projects found!" />
        )}
      </Container>
    </div>
    
  );
}

export default AvailableProjects;