function Projects() {
  return (
    <div id="projects" className="section">
      <h2 className="title">Projects</h2>

      <div className="project-grid">
        {/* Portfolio Project */}
        <div className="project-card">
          <h3>Personal Portfolio Website</h3>
          <p className="tech">React.js, CSS, Responsive Design</p>
          <p>
            Designed and developed a professional personal portfolio website to
            showcase projects, skills, certifications, and resume. Features
            include sticky navigation, responsive layout, and downloadable
            resume.
          </p>
          
              <a
                className="btn"
                href="https://rohitrao0.netlify.app"
                target="_blank"
                rel="noreferrer"
              >
                Live Demo
              </a>

        </div>

        {/* Educational Website */}
        <div className="project-card">
          <h3>Educational Website</h3>
          <p className="tech">HTML, CSS, JavaScript</p>
          <p>
            Educational platform with Student Helpdesk, subject-wise content,
            interactive quizzes, and Hogwarts-inspired UI design to enhance
            learning experience.
          </p>
         
        </div>

        {/* Diagon Alley Shop */}
        <div className="project-card">
          <h3>Diagon Alley Online Shop</h3>
          <p className="tech">React, JavaScript, CSS</p>
          <p>
            React-based e-commerce website with category filtering, responsive UI,
            and dynamic routing for smooth shopping experience.
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default Projects;
