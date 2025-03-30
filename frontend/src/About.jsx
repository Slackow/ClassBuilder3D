import './About.css';

function About() {
  return (
    <div className="about-container fade-in">
      <header className="about-header">
        <h1>Making a schedule is tough.</h1>
      </header>
      <section className="about-section left">
        <div className="section-content">
          <h2>...but it doesn't need to be.</h2>
          <p>
            With ClassBuilder3D, designing your class schedule becomes intuitive and efficient.
            Enjoy a guided process that adapts to your academic needs.
          </p>
        </div>
      </section>
      <section className="about-section right">
        <div className="section-content">
          <h2>Smart & Adaptive</h2>
          <p>
            Our platform ensures no overlapping classes while suggesting the optimal pathway to graduation.
          </p>
        </div>
      </section>
      <section className="about-section left">
        <div className="section-content">
          <h2>Insights at a Glance</h2>
          <p>
            Integrated tools like RateMyProfessor help you make informed decisions—all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
