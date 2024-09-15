import React from "react";

import Carousel from "react-material-ui-carousel";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button } from "@mui/material";

function CarouselComponent(props) {
  return (
    <>
      <Carousel
        // NavButton={({ onClick, className, next, prev, style }) => {
        //   // className = "mb-4 px-4 py-2 bg-transparent text-darkgreen";
        //   style = { color: "darkgreen" };
        //   return (
        //     <Button onClick={onClick} className={className} variant="Text">
        //       {next && (
        //         <>
        //           {"Next"}
        //           <ChevronRight />
        //         </>
        //       )}
        //       {prev && (
        //         <>
        //           <ChevronLeft />
        //           {"Previous"}
        //         </>
        //       )}
        //     </Button>
        //   );
        // }}
        // navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
        //     style: {
        //         backgroundColor: 'cornflowerblue',
        //         borderRadius: 0
        //     }
        // }} 
        navButtonsWrapperProps={{
          // Move the buttons to the bottom. Unsetting top here to override default style.
          style: {
            bottom: "0",
            top: "1",
          },
        }}
        navButtonsAlwaysVisible
        animation="slide"
        autoPlay={false}
        cycleNavigation={false}
      >
        {props.pages.map((page, i) => (
          <React.Fragment key={i}>{page.content}</React.Fragment>
        ))}
      </Carousel>
    </>
  );
}

export default CarouselComponent;
