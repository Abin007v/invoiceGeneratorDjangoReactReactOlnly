import { Box } from "@mui/system";
import React, { useState } from "react";
import "./UserPannel.css";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function UserPannel() {
  const [expanded, setExpanded] = useState("panel0");

  const handleChange = (e) => {
    setExpanded(e);
  };
  return (
    <div
      className="container-user"
      style={{ display: "grid", placeItems: "center" }}
    >
      <Box
        sx={{
          background: "white",
          height: "5vh",
          width: "40vw",
          margin: "20px 0",
          borderRadius: "20px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box sx={{ fontWeight: "900" }}>Customer Email : email@gmail.com</Box>
      </Box>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
        (item, index) => {
          return (
            <Box sx={{ width: "50vw", margin: "10px 0" }}>
              <Accordion
                expanded={expanded === `panel${index}`}
                onChange={(e) => handleChange(`panel${index}`)}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  sx={{}}
                >
                  <Typography>Bill Date : 10/10/2022</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{}}>
                  <Typography>
                    View Or Download Your bill
                    <a
                      style={{ marginLeft: "10px" }}
                      href="https://asset.cloudinary.com/dykmiet9x/d1b31e3af15de4e54111e6fc96f18c62"
                    >
                      <Button
                        variant="contained"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Click here
                      </Button>
                    </a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          );
        }
      )}
    </div>
  );
}

export default UserPannel;
