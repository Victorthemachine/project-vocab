import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { AppBar } from '@material-ui/core';

function Copyright() {
    return (
        <Typography fontWeight="600" variant="body1">
            <Link color="inherit" href="https://github.com/Victorthemachine/project-vocab">
                Vocabulary project
            </Link>
            {' © '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <AppBar position="static">
            <div style={{ "display": "flex", "flexDirection": "row", "justifyContent": "space-around", "padding": "20px" }}>
                <div style={{ "textAlign": "center" }}>
                    <Typography component={'div'} fontWeight="600" variant="body1">
                        This entire project was made thanks to the original Android application.<br />Check it out it has many other features that the website lacks:
                    </Typography>
                    <Link variant="body1" fontWeight="600" color="inherit" href='https://github.com/JosefLitos/SchoolManager/releases'>SchoolManager</Link>
                </div>
                <div>
                    <Typography component={'div'} fontWeight="600" variant="body1">
                        Webmaster: Nya~san#6539
                    </Typography>
                    <Copyright />
                </div>
                <div>
                    <Typography component={'div'} fontWeight="600" variant="body1">
                        <div style={{ "display": "flex", "flexDirection": "column", "justifyContent": "space-around" }}>
                            <Link color="inherit" fontWeight="600" href='https://github.com/JosefLitos'>
                                Transcription
                            </Link>
                            <Link color="inherit" fontWeight="600" href='https://github.com/Victorthemachine'>
                                Programming
                            </Link>
                        </div>
                    </Typography>
                </div>
            </div>
        </AppBar>
    );
}