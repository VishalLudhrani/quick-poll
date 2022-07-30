import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        }
      }
    }
  },
  typography: {
    fontFamily: "Epilogue",
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  palette: {
    common: {
      black: "#222",
      white: "fcfcfc"
    }
  }
})