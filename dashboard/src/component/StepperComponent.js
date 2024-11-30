import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Check,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Button,
  MobileStepper,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  stepConnectorClasses,
  styled,
  useMediaQuery,
} from "@mui/material";

// Custom styled connector
export const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1b5b40",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#123c29",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

// Custom Step Icon
const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#1b5b40",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#123c29",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

// Main Stepper Component
export default function StepperComponent(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const modalContentRef = useRef(null);
  const isMobile = !useMediaQuery("(min-width:600px)"); // Check if the screen is mobile

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    // Scroll to top only for mobile
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    setSkipped(newSkipped);

    // Call onStepChange callback
    if (props.onStepChange) {
      props.onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);

    // Call onStepChange callback
    if (props.onStepChange) {
      props.onStepChange(prevStep);
    }
  };

  function timedDisable(params) {
    setTimeout(() => {
    }, 0);
    return params;
  }

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeStep]);
  

  return (
    <Box
      ref={modalContentRef}
      sx={{ width: "100%", overflowY: "auto", maxHeight: "60vh" }}
    >
      {useMediaQuery("(min-width:600px)") ? (
        <>
          {props.renderStepContent(activeStep)}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
              marginBottom: "2rem",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="contained"
              disabled={ activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, bgcolor: "#1b5b40", color: "#fffafa" }}
            >
              <KeyboardArrowLeft /> Back
            </Button>
            <Stepper
              activeStep={activeStep}
              connector={<QontoConnector />}
              sx={{
                flex: "1 1 auto",
                width: "20%",
                paddingLeft: "10rem",
                paddingRight: "10rem",
                justifyItems: "center",
              }}
            >
              {props.pages.map((page, index) => {
                const stepProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={index} {...stepProps}>
                    <StepLabel StepIconComponent={QontoStepIcon} onClick={() => setActiveStep(index)}></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === props.pages.length - 1}
              sx={{ bgcolor: "#1b5b40", color: "#fffafa" }}
            >
              Next <KeyboardArrowRight />
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box>{props.renderStepContent(activeStep)}</Box>
          <MobileStepper
            variant="text"
            color="green"
            steps={props.pages.length}
            position="static"
            activeStep={activeStep}
            className="rounded-md"
            sx={{ marginBottom: "4rem", bgcolor: "#1b5b40", color: "#fffafa", marginTop: "2rem" }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === props.pages.length - 1}
                sx={{ color: "#fffafa" }}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ color: "#fffafa" }}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
}


StepperComponent.propTypes = {
  pages: PropTypes.array.isRequired,
  renderStepContent: PropTypes.func.isRequired,
  onStepChange: PropTypes.func,
};
