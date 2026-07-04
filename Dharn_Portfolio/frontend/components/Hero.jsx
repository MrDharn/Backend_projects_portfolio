const Hero = () => {
  return (
    <section className="text-center py-32">
      <h1 className="text-6xl font-bold">Hi, I'm Daniel</h1>

      <p className="mt-4">Backend Engineer</p>

      <div className="space-x-4 mt-8">
        <a href="#projects">
          <button>Projects</button>
        </a>

        <a href="http://localhost:5000/api/resume">
          <button>
            <a
              href="http://localhost:5000/api/resume"
              target="_blank"
              rel="noreferrer"
            >
              Download Resume
            </a>
          </button>
        </a>
      </div>
    </section>
  );
};

export default Hero;
