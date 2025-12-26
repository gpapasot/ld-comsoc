import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box, Typography } from "@mui/material";
import { blueGrey, amber, green, lightBlue } from "@mui/material/colors";

const Footer = () => {
    return (
        // <footer style={{position: 'sticky'}}> 
        //     <AppBar color="primary">
        //         <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'row'}}>
        //             A Community-Maintained Survey    ·    © 2025 Liquid Democracy in Social Choice</a>.
        //         </div>
        //     </AppBar>
        // </footer>
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 3,
                mt: 'auto',
                flexShrink: 0
            }}>
            <Typography gutterBottom align="center">
            A Community-Maintained Survey    ·    © 2025 Liquid Democracy in Social Choice
            </Typography>
            
        </Box>
    );
};


export default Footer;