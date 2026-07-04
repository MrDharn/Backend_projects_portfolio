import Container from "../ui/Container";
import Button from "../ui/Button";

const Navbar = () => {
  return (
    <header className="fixed w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
      <Container>

        <div className="flex justify-between items-center h-20">

          <h1 className="text-2xl font-bold text-blue-500">
            Daniel
          </h1>

          <nav className="hidden md:flex gap-8">

            <a href="#about">About</a>

            <a href="#skills">Skills</a>

            <a href="#projects">Projects</a>

            <a href="#contact">Contact</a>

          </nav>

          <Button
            href="http://localhost:5000/api/resume"
          >
            Resume
          </Button>

        </div>

      </Container>
    </header>
  );
};

export default Navbar;