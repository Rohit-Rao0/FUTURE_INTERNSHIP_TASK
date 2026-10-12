import profile from "../assets/profile.jpg";

function Home() {
  return (
    <div id="home" className="hero">
      <div className="hero-text">
        <h1>
          Hi, I'm <span>Rohit</span>
        </h1>
        <h3> MERN Stack Developer</h3>

        <p>
          Motivated Developer with strong proficiency in JavaScript, React, HTML,
          CSS and Bootstrap. Skilled in building responsive user interfaces with
          solid foundation in SQL, Python and full-stack development using Node.js,
          Express and MongoDB. Passionate about building intuitive web
          applications and contributing to impactful digital platforms.
        </p>

        <a className="btn" href="/resume.pdf" download>
          📄 Download Resume
        </a>
      </div>

      <div className="hero-img">
        <img src={profile} alt="Rohit" />
      </div>
    </div>
  );
}

export default Home;
