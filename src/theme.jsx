import { extendTheme } from '@chakra-ui/react';

const colors = {
  customBlue: {
    500: "#3A77FE",
    600: "#275ACD",
  },
  customGray: {
    400: "#4A5568",
    500: "#3A4157",
  },
  body: {
    dark: "#191D26",
    light: "#FCFCFC",
  },
  footer: {
    dark: "#1F2430",
    light: "#E2E8F0",
  },
  text: {
    dark: "#AAB3CB",
    light: "#4A5568",
  }
};

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors,
  styles: {
    global: (props) => ({
      body: {
        fontFamily: `"Roboto", sans-serif`,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        backgroundColor: props.colorMode === 'dark' ? colors.body.dark : colors.body.light,
        margin: 0,
      },
      "#root": {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      },
      "body, html": {
        margin: 0,
        padding: 0,
        width: '100%',
      },
    }),
  },
  components: {
    Box: {
      baseStyle: {
        borderRadius: "8px",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "18px",
      },
      variants: {
        simple: {
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "0.3s",
          backgroundColor: colors.customBlue[500],
          color: "#ffffff",
          "@media screen and (max-width: 450px)": {
            fontSize: "11px",
            p: "0 15px",
          },
          _hover: {
            backgroundColor: colors.customBlue[600],
            cursor: "pointer",
          },
        },
        revoke: {
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "0.3s",
          size:"xs",
        },
        icon: {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          borderWidth: "1px",
          transition: "0.3s",
          _dark: {
            backgroundColor: colors.customGray[500],
            borderColor: colors.customGray[500],
            _hover: {
              backgroundColor: colors.customGray[400],
              borderColor: colors.customGray[400],
              cursor: "pointer",
              ".white": { color: "white" },
              ".twitter": { color: "#1DA1F2" },
            },
          },
          _light: {
            backgroundColor: "gray.100",
            borderColor: "gray.100",
            _hover: {
              backgroundColor: "gray.300",
              borderColor: "gray.300",
              cursor: "pointer",
            },
          }
        },
        iconxs: {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          borderWidth: "1px",
          transition: "0.3s",
          p: "1px 0",
          _dark: {
            backgroundColor: colors.customGray[500],
            borderColor: colors.customGray[500],
            _hover: {
              backgroundColor: colors.customGray[400],
              borderColor: colors.customGray[400],
              cursor: "pointer",
              ".white": { color: "white" },
            },
          },
          _light: {
            backgroundColor: "gray.100",
            borderColor: "gray.100",
            _hover: {
              backgroundColor: "gray.300",
              borderColor: "gray.300",
              cursor: "pointer",
            },
          }
        }
      }
    },
    Link: {
      baseStyle: {
        fontSize: "sm",
        color: "gray.500",
        _hover: { color: "blue.500" }
      },
      variants: {
        gradientText: {
          background: "linear-gradient(90deg, #49EBBF, #20BDFF, #4068FF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontWeight: "bold",
          textDecoration: "none",
          _hover: {
            textDecoration: "none"
          }
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: colors.customBlue[500],
            borderColor: colors.customBlue[500],
            color: 'white',
            _hover: {
              bg: colors.customBlue[600],
              borderColor: colors.customBlue[600],
            },
          },
          _hover: {
            borderColor: colors.customBlue[500],
          }
        }
      }
    },
    Text: {
      baseStyle: {
        fontSize: "sm",
        color: "gray.500",
      },
    },
  },
});

export default theme;

