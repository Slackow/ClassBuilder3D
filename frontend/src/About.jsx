import './About.css';

function About() {
  return (
    // Keep the main container for scrolling and fade-in
    <div className="about-container fade-in">

      {/* Header Section */}
      <header className="about-header">
        {/* Add a wrapper div to apply card styling */}
        <div className="content-card header-card">
          <h1>Making a schedule is tough.</h1>
        </div>
      </header>

      {/* Section 1 */}
      <section className="about-section left">
        {/* Apply card styling to the existing section-content */}
        <div className="section-content content-card">
          <h2>...but it doesn't need to be.</h2>
          <p>
            With ClassBuilder3D, designing your class schedule becomes intuitive and efficient.
            Enjoy a guided process that adapts to your academic needs.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="about-section right">
        {/* Apply card styling to the existing section-content */}
        <div className="section-content content-card">
          <h2>Smart & Adaptive</h2>
          <p>
            Our platform ensures no overlapping classes while suggesting the optimal pathway to graduation.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="about-section left">
         {/* Apply card styling to the existing section-content */}
        <div className="section-content content-card">
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