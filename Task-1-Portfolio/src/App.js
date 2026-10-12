import "./App.css";
import Home from "./components/Home";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Achievements from "./components/Achievements";
import Education from "./components/Education";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      {/* Sticky Navbar */}
      <div className="navbar">
        <h2>Rohit</h2>
        <div>
          <a href="#home">Home</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#certifications">Certifications</a>
          <a href="#achievements">Achievements</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <Home />
        <Skills />
        <Projects />
        <Certifications />
        <Achievements />
        <Education />
        <Contact />

        <div className="footer">
          © 2026 Rohit | MCA | MERN Stack Developer
        </div>
      </div>
    </>
  );
}

export default App;
