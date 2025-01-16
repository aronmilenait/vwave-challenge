/* eslint-disable react/react-in-jsx-scope */
const Footer = () => {
  const linkClasses = "font-bold hover:text-cyan-400 transition-colors";

  return (
    <footer className="bg-cyan-950 text-cyan-50 py-6">
      <div className="mx-auto px-6 text-center">
        <p className="text-lg mb-4">
          Made with ♥ by{" "}
          <a
            className={linkClasses}
            href="https://www.linkedin.com/in/milenasaron/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Milena Sol Aron
          </a>
        </p>
        <a
          className={linkClasses}
          href="https://github.com/aronmilenait/vwave-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer;
