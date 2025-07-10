import { useLocation } from "react-router-dom";
import Message from "../../layout/Message/Message";

function AvailableProjects() {

  const location = useLocation();
  let message = '';
  if (location.state) {
    message = location.state.message;
  }
  return (
    <div>
      <h1>Available Projects</h1>
      { message && <Message type="success" text={message} /> }
    </div>
    
  );
}

export default AvailableProjects;