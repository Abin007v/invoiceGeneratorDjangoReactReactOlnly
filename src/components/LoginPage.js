import React, { useState } from "react";
import "./LoginPage.css";
// import { Button } from "@mui/material";
import {} from "@emotion/styled";
import {} from "@emotion/react";
import SendIcon from "@mui/icons-material/Send";

import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { ChakraProvider } from "@chakra-ui/react";

import logo from "./img/log.svg";
import reg from "./img/register.svg";
import { Link, useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [cnt, setCnt] = useState("container");
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const signUpClick = () => {
    setCnt("container sign-up-mode");
  };
  const signInClick = () => {
    setCnt("container");
  };
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  //register start
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [usn, setUsn] = useState("");
  // const [pass, setPass] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  const signupclick = () => {
    // const data = axios
    //   .post("/api/stud/register", {
    //     name: name,
    //     branch: branch,
    //     sem: sem,
    //     usn: usn,
    //     pass: pass,
    //     confirmpass: confirmpass,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     window.alert("succesfull");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  //register  end

  // login stud start
  const [email, setemial] = useState("");
  const [pass, setpass] = useState("");
  const loginclick = async () => {
    try {
      if (email != "" && pass != "") {
        const res = await axios.get("http://127.0.0.1:8000/api/singleuser/", {
          params: {
            email: email,
          },
        });
        console.log(res);
        if (
          res.data &&
          res.data[0].email == email &&
          res.data[0].password == pass
        ) {
          navigate("/user", { state: email });
        }
      }
    } catch (err) {
      console.log(err);
      window.alert("wrong email or password");
    }
  };
  //login stud end

  const [venemail, setVenEmail] = useState("");
  const [venpassword, setVenPassword] = useState("");

  const submitvenHandler = async () => {
    try {
      if (venemail != "" && venpassword != "") {
        const res = await axios.get("http://127.0.0.1:8000/api/singleadmin/", {
          params: {
            email: venemail,
          },
        });
        console.log(res);
        if (
          res.data[0].email == venemail &&
          res.data[0].password == venpassword
        ) {
          navigate("/invoice");
        }
      }
    } catch (err) {
      console.log(err);
      window.alert("wrong email or password");
    }
  };
  return (
    <div className={`${cnt}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field-new">
              <Accordion
                // expanded={expanded === "panel1"}
                expanded
                onChange={handleChange("panel1")}
                sx={{
                  width: "300px",
                  background: "transparent",
                  boxShadow: "none",
                  marginBottom: "20px",
                  border: "none",
                }}
              >
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    background: "#2b6cb0",
                    color: "white",
                    borderRadius: "10px",
                    height: "40px",
                  }}
                >
                  <Typography
                    sx={{
                      flexShrink: 0,
                      fontFamily: "nunito",
                      fontSize: "1.3rem ",
                    }}
                  >
                    Customer Login
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <ChakraProvider>
                      <VStack spacing="10px">
                        <FormControl id="email" isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            // value={usnlogin}
                            onChange={(e) => setemial(e.target.value)}
                            sx={{ border: "3px solid white" }}
                            value={email}
                            type="text"
                            placeholder="Enter Your Email"
                            // onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl id="password" isRequired>
                          <FormLabel>Password</FormLabel>
                          <InputGroup size="md">
                            <Input
                              // value={passlogin}
                              // onChange={(e) => setPasslogin(e.target.value)}
                              sx={{ border: "3px solid white" }}
                              value={pass}
                              onChange={(e) => setpass(e.target.value)}
                              type={show ? "text" : "password"}
                              placeholder="Enter password"
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                onClick={handleClick}
                              >
                                {show ? "Hide" : "Show"}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        {/* <Link to={"/user"}> */}
                        <Button
                          colorScheme="blue"
                          width="240px"
                          style={{ marginTop: 15 }}
                          onClick={loginclick}
                          isLoading={loading}
                        >
                          Login
                        </Button>
                        {/* </Link> */}
                      </VStack>
                    </ChakraProvider>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </form>

          <form className="sign-up-form">
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              sx={{
                width: "300px",
                background: "transparent",
                boxShadow: "none",
                border: "none",
                marginBottom: "20px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                sx={{
                  background: "#2b6cb0",
                  color: "white",
                  borderRadius: "10px",
                  height: "40px",
                }}
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    fontFamily: "nunito",
                    fontSize: "1.3rem ",
                  }}
                >
                  Vendor Login
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ChakraProvider>
                    <VStack spacing="10px">
                      <FormControl id="email" isRequired>
                        <FormLabel>E-mail</FormLabel>
                        <Input
                          sx={{ border: "3px solid white" }}
                          value={venemail}
                          type="text"
                          placeholder="Enter Your Email"
                          onChange={(e) => setVenEmail(e.target.value)}
                        />
                      </FormControl>
                      <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="md">
                          <Input
                            sx={{ border: "3px solid white" }}
                            value={venpassword}
                            onChange={(e) => setVenPassword(e.target.value)}
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                          />
                          <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      {/* <Link to={"/invoice"}> */}
                      <Button
                        colorScheme="blue"
                        width="240px"
                        style={{ marginTop: 15 }}
                        onClick={submitvenHandler}
                        isLoading={loading}
                      >
                        Login
                      </Button>
                      {/* </Link> */}
                    </VStack>
                  </ChakraProvider>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Are you a vendor?</h3>
            <p>If you're an registerd vendor login through here</p>
            <Button
              sx={{ color: "white", borderRadius: "30px" }}
              onClick={signUpClick}
              className="btn transparent"
              id="sign-up-btn"
              variant="outlined"
            >
              Sign In
            </Button>
          </div>
          <img src={logo} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Are you a Customer ?</h3>
            <p>If you have made a purchase login through here</p>

            <Button
              sx={{ color: "white", borderRadius: "30px" }}
              onClick={signInClick}
              className="btn transparent"
              id="sign-up-btn"
              variant="outlined"
            >
              Sign In
            </Button>
          </div>
          <img src={reg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
