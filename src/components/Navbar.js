import Typography from "@mui/material/Typography";
import * as React from "react";
import HomeIcon from '@mui/icons-material/Home';
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function Navbar() {
    let navigate = useNavigate();
    return (
      <Box
        display={"grid"}
        width={"100vw"}
        height={"37px"}
        boxShadow={"0 2px 2px -2px rgba(0,0,0,.2)"}
        gridTemplateColumns={"1fr 1fr 1fr"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} paddingLeft={"25px"}>
          <HomeIcon
            cursor={"pointer"}
            onClick={() => navigate("./librairif/", { replace: true })}
          />
        </Box>
        <Typography justifySelf={"center"} fontSize={"l"} fontWeight={"bold"}>
          LibrairIf
        </Typography>
        <Box></Box>
      </Box>
    );
}