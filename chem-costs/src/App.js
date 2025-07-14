import Home from './components/pages/Home/Home'
import Company from './components/pages/Company'
import Contact from './components/pages/Contact'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import Container from './components/layout/Container/Container'
import NewProject from './components/pages/NewProject/NewProject'
import EditProject from './components/pages/EditProject/EditProject'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AvailableProjects from './components/pages/AvailableProjects/AvailableProjects'

function App() {


  return (
    <Router>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/company" element={<Company />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newproject" element={<NewProject />} />
            <Route path="/availableprojects" element={<AvailableProjects />} />
            <Route path="/project/:id" element={<EditProject />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
