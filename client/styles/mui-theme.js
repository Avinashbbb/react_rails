import { createMuiTheme } from '@material-ui/core';
import theme from './theme';

const muiTheme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: theme.app.mainColor,
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: theme.app.ctaButtonBgColor,
        color: theme.app.white,
        '&:hover': {
          backgroundColor: theme.app.ctaButtonBgColorHover,
        },
        '&.cta-add-location': {
          backgroundColor: '#e0e0e0',
          color: 'rgba(0, 0, 0, 0.87)',
          height: '43px',
          width: '100%',
          '&:hover': {
            backgroundColor: '#d5d5d5',
          },
          '& $label': {
            display: 'flex',
            alignItems: 'end',
            '& svg': {
              marginRight: '5px',
            },
          },
        },
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: theme.app.ctaButtonBgColorHover,
        },
      },
      outlined: {
        borderColor: theme.app.ctaButtonBgColor,
        color: theme.app.ctaButtonBgColor,
      },
    },
    MuiFab: {
      root: {
        color: 'white',
        backgroundColor: theme.app.ctaButtonBgColor,
        '&:hover': {
          backgroundColor: theme.app.ctaButtonBgColorHover,
        },
      },
    },
    MuiDialogActions: {
      root: {
        margin: '24px 20px',
      },
    },
    MuiDialogContent: {
      root: {
        padding: '15px 24px 24px',
      },
    },
    MuiDialogTitle: {
      root: {
        padding: '24px',
      },
    },
    MuiFormControl: {
      root: {
        '&.full-width': {
          width: '100%'
        },
        '&.filter-width': {
          width: '125px',
          '@media (min-width: 992px)': {
            width: '217px',
          },
        },
        '&.two-thirds': {
          width: '73%',
        },
      },
    },
    MuiFormGroup: {
      root: {
        '&.form-group-disabled': {
          opacity: '.3',
        },
      },
    },
    MuiFormHelperText: {
      root: {
        display: 'none',
      },
      error: {
        display: 'block',
      },
    },
    MuiFormLabel: {
      focused: {
        color: `${theme.app.mainColor} !important`,
      },
    },
    MuiIconButton: {
      root: {
        color: theme.app.iconButtonColor,
      },
    },
    MuiOutlinedInput: {
      focused: {
        '& $notchedOutline': {
          borderColor: theme.app.mainColor,
        },
      },
      input: {
        padding: '12.5px 25px',
      },
    },
    MuiSelect: {
      select: {
        '&:focus': {
          background: 'none',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        '&.prepared-icon-color': {
          color: theme.app.preparedIconColor,
        },
        '&.menu-icon-color': {
          color: theme.app.iconButtonColor,
        },
      },
    },
    MuiTab: {
      label: {
        fontWeight: 500,
      },
      root: {
        '&:hover': {
          backgroundColor: '#fbfbfb',
        },
      },
      selected: {
        color: `${theme.app.mainColor} !important`,
      },
      textColorPrimary: {
        color: theme.app.tabsUnselectedColor,
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: theme.app.mainColor,
      },
    },
    MuiTableCell: {
      root: {
        whiteSpace: 'nowrap',
        padding: '4px 0px 4px 25px',
        textOverflow: 'ellipsis',

        '&.action-cell': {
          paddingRight: '25px',
          textAlign: 'left',
          width: '8%',
        },
        '&.icon-cell': {
          padding: 0,
          textAlign: 'center',
          width: '8%',
        },
        '&.province-cell': {
          paddingRight: '25px',
          width: '8%',
        },
        '&.zipcode-cell': {
          width: '8%',
        },
        '&.no-pointer': {
          cursor: 'default !important',
        },
      },
    },
    MuiTablePagination: {
      caption: {
        color: theme.app.lightGrey,
      },
      select: {
        color: theme.app.lightGrey,
        fontSize: '0.750em',
      },
      toolbar: {
        padding: '60px 24px',
      },
    },
    MuiTableRow: {
      root: {
        height: '60px',
        transition: 'background-color .25s ease-in-out',
        '&:nth-child(even)': {
          backgroundColor: theme.app.tableRowsOddBgColor,
        },
        '&.link-row:hover': {
          backgroundColor: '#e7f8ff',
          cursor: 'pointer',
        },
      },
    },
    MuiTableSortLabel: {
      root: {
        fontWeight: 400,
      },
    },
  },
  palette: {
    primary: {
      light: '#89d2ff',
      main: theme.app.brandColor,
      dark: '#0073cb',
      contrastText: '#fff',
    },
    secondary: {
      light: '#8fffff',
      main: '#5CC0EC',
      dark: '#00b0bb',
      contrastText: '#fff',
    },
    background: {
      default: theme.app.bodyBackground,
    },
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: '#0000008a',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
  typography: {
    useNextVariants: true,
    body1: {
      fontSize: '0.8rem',
    },
    display1: {
      color: theme.app.titleFontColor,
      fontSize: '1.2rem',
      fontWeight: 300,
      lineHeight: '1.20588em',
    },
    title: {
      color: theme.app.titleFontColor,
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: '1.20588em',
    },
  },
});


export default muiTheme;
