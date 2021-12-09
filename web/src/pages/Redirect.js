import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Listing() {
    const history = useHistory();

    return (
        <div style={{ "display": "flex", "flexDirection": "column", "height": "100%" }}>
            <Button variant="contained" color="primary" onClick={() => history.push("/vocab/aj")}>
                <Typography variant="h1">AJ</Typography>
            </Button>
            <Button variant="contained" color="primary" onClick={() => history.push("/vocab/nj")}>
                <Typography variant="h1">NJ</Typography>
            </Button>
            <Button variant="contained" color="primary" onClick={() => history.push("/vocab/snj")}>
                <Typography variant="h1">SNJ</Typography>
            </Button>
            <Button variant="contained" color="primary" onClick={() => history.push("/admin")}>
                <Typography variant="h1">Restricted</Typography>
            </Button>
        </div>
    );
}
