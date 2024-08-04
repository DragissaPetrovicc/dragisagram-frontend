import {
  FormControl as MuiFormControl,
  styled,
  ButtonGroup,
  Box,
  TextField,
  Button,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  CustomBoxProps,
  CustomButtonProps,
  TabPanelProps,
} from "../config/types";
import { SxProps, Theme } from "@mui/material";

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

export const CustomOutlinedInput = styled(OutlinedInput)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
    "& input": {
      color: "#000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#000",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000",
  },
});

export const CustomFormControl = styled(MuiFormControl)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#FFDF00",
    },
    "&:hover fieldset": {
      borderColor: "#FFDF00",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFDF00",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#FFDF00",
  },
  "& .MuiSelect-root": {
    color: "#FFDF00",
  },
});

export const CustomButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "#FFDF00",
  },
  "& .MuiButtonGroup-grouped:not(:first-of-type)": {
    borderColor: "#FFDF00",
  },
});

export const style: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: { xs: "61%", md: "70%" },
  bgcolor: "transparent",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
  border: "3px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 2,
  gap: 5,
  [theme.breakpoints.up("md")]: {
    width: "60%",
  },
});

export const stylee: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "70%",
  bgcolor: "white",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
  border: "3px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 2,
  gap: 5,
  [theme.breakpoints.up("md")]: {
    width: "60%",
  },
});

export const CustomBox: React.FC<CustomBoxProps> = ({ children }) => {
  return <Box sx={style}>{children}</Box>;
};

export const CustomWhiteButton: React.FC<CustomButtonProps> = ({
  variant,
  endIcon,
  children,
  component,
  onClick,
  ...props
}) => (
  <Button
    variant={variant}
    endIcon={endIcon}
    component={component}
    onClick={onClick}
    {...props}
    className="!bg-white !text-black !w-min !whitespace-nowrap !font-semibold hover:scale-105 hover:font-bold hover:border-4 hover:border-black hover:bg-black hover:text-white"
  >
    {children}
  </Button>
);

export const CustomBlackButton: React.FC<CustomButtonProps> = ({
  variant,
  endIcon,
  children,
  component,
  onClick,
  ...props
}) => (
  <Button
    variant={variant}
    endIcon={endIcon}
    component={component}
    onClick={onClick}
    {...props}
    className="!bg-black !text-white !w-min !whitespace-nowrap !font-semibold hover:scale-105 hover:font-bold hover:border-4 hover:border-black"
  >
    {children}
  </Button>
);

export const CustomTransparentButton: React.FC<CustomButtonProps> = ({
  variant,
  endIcon,
  children,
  component,
  onClick,
  ...props
}) => (
  <Button
    variant={variant}
    endIcon={endIcon}
    component={component}
    onClick={onClick}
    {...props}
    className="!w-min !whitespace-nowrap !bg-transparent !text-black !font-semibold hover:scale-105 hover:font-bold hover:border-3"
  >
    {children}
  </Button>
);
export const CustomTextFieldBlack = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
    "& input": {
      color: "#000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#000",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000",
  },
});

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const stil = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFDF00",
  borderRadius: "10px",
  color: "black",
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
  border: "3px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 2,
  gap: 5,
};

export const stilistika = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "white",
  borderRadius: "10px",
  color: "black",
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
  border: "3px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 2,
  gap: 5,
};
