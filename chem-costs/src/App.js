import Home from './components/pages/Home/Home'
import Company from './components/pages/Company'
import Contact from './components/pages/Contact'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import NewProject from './components/pages/NewProject/NewProject'
import Container from './components/layout/Container/Container'
import AvailableProjects from './components/pages/AvailableProjects'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {


  return (
    <Router>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/company" element={<Company />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/newproject" element={<NewProject />} />
            <Route exact path="/availableprojects" element={<AvailableProjects />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
