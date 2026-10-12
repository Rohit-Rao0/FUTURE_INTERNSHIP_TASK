function Skills() {
  return (
    <div id="skills" className="section">
      <h2 className="title">Technical Skills — MERN Stack Developer</h2>

      {/* Frontend */}
      <h4>Front-end</h4>
      <div className="skills-grid">
        <div className="skill-box">HTML5</div>
        <div className="skill-box">CSS3</div>
        <div className="skill-box">JavaScript (ES6+)</div>
        <div className="skill-box">React.js</div>
      
        <div className="skill-box">Bootstrap</div>
        <div className="skill-box">Tailwind CSS</div>
        <div className="skill-box">Responsive Design</div>
        <div className="skill-box">REST API Integration</div>
        <div className="skill-box">Form Validation</div>
     
      </div>

      {/* Backend */}
      <h4 style={{ marginTop: "14px" }}>Back-end</h4>
      <div className="skills-grid">
        <div className="skill-box">Node.js</div>
        <div className="skill-box">Express.js</div>
        <div className="skill-box">RESTful APIs</div>
        <div className="skill-box">JWT Authentication</div>
        <div className="skill-box">Cookies & Sessions</div>
        <div className="skill-box">Middleware</div>
        <div className="skill-box">Error Handling</div>
        <div className="skill-box">MVC Architecture</div>
        <div className="skill-box">Python</div>
      </div>

      {/* Database */}
      <h4 style={{ marginTop: "14px" }}>Database</h4>
      <div className="skills-grid">
        <div className="skill-box">MongoDB</div>
        <div className="skill-box">MYSQL</div>
       
        
      </div>

      {/* Tools */}
      <h4 style={{ marginTop: "14px" }}>Tools & Platforms</h4>
      <div className="skills-grid">
        
        <div className="skill-box">GitHub</div>
        <div className="skill-box">Postman</div>
        <div className="skill-box">VS Code</div>
        <div className="skill-box">npm</div>
        <div className="skill-box">MongoDB Compass</div>
        <div className="skill-box">Workbench</div>
      
        
      </div>

   
      
      
      

      {/* Soft Skills */}
      <h4 style={{ marginTop: "14px" }}>Soft Skills</h4>
      <div className="skills-grid">
        <div className="skill-box">Problem Solving</div>
        <div className="skill-box">Team Collaboration</div>
        <div className="skill-box">Time Management</div>
        <div className="skill-box">Communication</div>
      </div>
    </div>
  );
}

export default Skills;
