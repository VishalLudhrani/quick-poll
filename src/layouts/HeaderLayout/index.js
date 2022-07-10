import { Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Container from "../../components/common/Container";

const HeaderLayout = ({ title, sideMenu, children, className }) => {
  return (
    <Container className={className}>
      <div className="flex items-center justify-between">
        <Typography variant="h2" as="h1">{title}</Typography>
        <div className="flex items-center justify-end gap-x-4">{sideMenu}</div>
      </div>
      <div className="mt-4">{children}</div>
    </Container>
  )
}

HeaderLayout.defaultProps = {
  className: "",
}

HeaderLayout.propTypes = {
  title: PropTypes.string.isRequired,
  sideMenu: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default HeaderLayout;