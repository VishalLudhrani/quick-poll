import PropTypes from "prop-types";

const Container = ({ children, className }) => {
  return (
    <div className={"mx-auto sm:w-9/12 p-4 w-full " + className}>{children}</div>
  );
};

Container.defaultProps = {
  className: "",
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Container;
