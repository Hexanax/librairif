import "./Navbar.css"
import Typography from "@mui/material/Typography";
import * as React from "react";
import HomeIcon from '@mui/icons-material/Home';
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function Navbar() {
    let navigate = useNavigate();
    return (
        <div className={"navbarWrapper"}>
            <Box
                display={"flex"}
                alignItems={"center"}
                paddingLeft={"25px"}>
                <HomeIcon
                    cursor={"pointer"}
                    onClick={() => navigate("./", {replace: true})}
                />

            </Box>
            <Typography
                justifySelf={"center"}
                fontSize={"l"}
                fontWeight={"bold"}
            >
                LibrairIf
            </Typography>
            <div>

            </div>
        </div>
    )
}