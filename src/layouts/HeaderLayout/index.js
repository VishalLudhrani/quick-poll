import { Container, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

const HeaderLayout = ({ title, sideMenu, children, sx }) => {
  return (
    <Container sx={{
      ...sx,
      mt: 4,
      py: 2
    }}>
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h3" component="h1">{title}</Typography>
        </Grid>
        <Grid item container xs={12} sm={6} justifyContent="flex-end" sx={{ gap: 2 }}>{sideMenu}</Grid>
      </Grid>
      {children}
    </Container>
  )
}

HeaderLayout.defaultProps = {
  sx: {},
}

HeaderLayout.propTypes = {
  title: PropTypes.string.isRequired,
  sideMenu: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
}

export default HeaderLayout;