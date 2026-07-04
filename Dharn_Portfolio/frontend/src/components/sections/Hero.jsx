import Button from "../ui/Button";
import Container from "../ui/Container";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center">

      <Container>

        <p className="text-blue-500 mb-4">
          Backend Engineer
        </p>

        <h1 className="text-6xl font-bold leading-tight">
          Hi,
          <br />
          I'm Daniel.
        </h1>

        <p className="text-gray-400 mt-8 max-w-xl">

          I build scalable backend
          applications using Node.js,
          Express, MongoDB and PostgreSQL.

        </p>

        <div className="flex gap-4 mt-10">

          <Button href="#projects">
            View Projects
          </Button>

          <Button
            variant="outline"
            href="http://localhost:3000/api/resume"
          >
            Download Resume
          </Button>

        </div>

      </Container>

    </section>
  );
};

export default Hero;