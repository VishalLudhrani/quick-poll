import { Container } from "@mui/material";
import PropTypes from "prop-types";

const Jumbotron = ({ sx, children }) => {
  return (
    <Container sx={sx}>
      {children}
    </Container>
  )
}

Jumbotron.defaultProps = {
  sx: {},
}

Jumbotron.propTypes = {
  children: PropTypes.element.isRequired,
  sx: PropTypes.object,
}

export default Jumbotron;