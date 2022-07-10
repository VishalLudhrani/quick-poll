import PropTypes from "prop-types";

const Jumbotron = ({ className, children }) => {
  return (
    <div className={"mx-auto sm:w-8/12 p-4 mt-8 w-full" + className}>
      {children}
    </div>
  )
}

Jumbotron.defaultProps = {
  className: "",
}

Jumbotron.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
}

export default Jumbotron;