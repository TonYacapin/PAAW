import React, { useState, useRef } from "react";
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
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  useMediaQuery,
} from "@mui/material";
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

// Custom step icon styling
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
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#1b5b40",
      },
    },
  ],
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



export default function StepperComponent(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const contentRef = useRef(null); // Create a ref to scroll the content (works for both modal and page content)

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const nextStep = activeStep + 1;
    setActiveStep(nextStep);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);

    // Call the onStepChange prop with the new step
    if (props.onStepChange) {
      props.onStepChange(prevStep);
    }

    // Scroll to the top of the content
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleReset = () => {
    setActiveStep(0);

    // Call the onStepChange prop with the reset step (0)
    if (props.onStepChange) {
      props.onStepChange(0);
    }
  };

  return (
    <Box sx={{ width: "100%", flexDirection: "row", gap: "10rem" }}>
      {useMediaQuery("(min-width:600px)") ? (
        <>
          {/* Add a ref to the scrollable content */}
          <Box ref={contentRef} sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {props.renderStepContent(activeStep)}
          </Box>
          <React.Fragment>
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
                disabled={activeStep === 0}
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
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={index} {...stepProps}>
                      <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
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
          </React.Fragment>
        </>
      ) : (
        <>
          {/* Mobile view */}
          <Box ref={contentRef} sx={{ maxHeight: "400px", overflowY: "auto"}}>
            {props.renderStepContent(activeStep)}
          </Box>
          <MobileStepper
            variant="text"
            steps={props.pages.length}
            position="static"
            activeStep={activeStep}
            sx={{ marginBottom: "4rem", bgcolor: "#1b5b40", color: "#fffafa", borderRadius: '0 0 6px 6px' }}
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