import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  const [links, setlinks] = useState(null);

  const getData = async (email) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/singleuser/link", {
        params: {
          email: email,
        },
      });
      console.log(res.data);
      setlinks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location && location.state) {
      getData(location.state);
    }
  }, [location]);

  // useEffect(() => {
  //   getData();
  // }, []);
  return (
    <div
      className="container-user"
      style={{
        display: "grid",
        gridTemplateRows: "15vh 1fr",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          background: "white",
          height: "5vh",
          width: "40vw",
          margin: "auto",
          borderRadius: "20px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box sx={{ fontWeight: "900" }}>Customer Email : {location.state}</Box>
      </Box>

      <Box>
        {links &&
          links.map((item, index) => {
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
                    <Typography>Bill Date : {item.date_created}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{}}>
                    <Typography>
                      View Or Download Your bill
                      <a style={{ marginLeft: "10px" }} href={item.link}>
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
          })}
      </Box>
    </div>
  );
}

export default UserPannel;
