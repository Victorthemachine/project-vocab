import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Grid, makeStyles, Collapse, IconButton } from '@material-ui/core';
import WordTable from '../components/WordTable';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { InView } from 'react-intersection-observer'
import { Alert, StepButton } from '@mui/material';
import { HashLink } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles({
    stepper: {
        background: '#303030',
    },
});

export default function Listing() {
    const classes = useStyles();
    const [vocab, setVocab] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [bounty, setBounty] = React.useState({});
    const [open, setOpen] = React.useState(true);
    const stepperContent = [];
    const history = useHistory();

    let content = (
        <div style={{ "display": "flex", "flexDirection": "column", "align-items": "center" }}>
            <CircularProgress />
            <Typography>Loading...</Typography>
        </div>
    );
    let loaded = false;

    useEffect(() => {
        axios.post(`https://dev.langvocab.xyz/vocab`, { "lang": (history.location.pathname).slice(7) })
            .then(res => {
                setVocab(res.data);
            })
            .catch(err => {
                console.error(err);
            })
    }, [])

    useEffect(() => {
        if (Object.keys(vocab).length < 1) {
            axios.post(`https://dev.langvocab.xyz/bounty`)
                .then(res => {
                    setBounty(res.data)
                })
                .catch(err => {
                    console.error(err);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const tables = [];
    if (vocab && Object.keys(vocab).length > 0) {
        let index = 0;
        for (let i in vocab) {
            stepperContent.push(i);
            let trueIndex = parseInt(`${index}`);
            let partial = (
                <InView threshold="0.1" onChange={(inView) => inView === true ? setActiveStep(trueIndex) : console.log('invis')}>
                    {({ ref, inView }) => (
                        <div key={i} ref={ref} id={trueIndex}>
                            <Typography variant="h3" align='center' >{i}</Typography>
                            <WordTable vocab={vocab[i]} />
                        </div>
                    )}
                </InView>);
            tables.push(partial);
            index++;
        }
        content = tables
        loaded = true;
    }

    return (
        <div>
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="info"
                    sx={{ mb: 2 }}
                >
                    {`${bounty && Object.keys(bounty).length > 0 && Object.keys(bounty).includes((history.location.pathname).slice(7)) ? `Next test from batches: ${(bounty[(history.location.pathname).slice(7)]).join(', ')}. Good luck!` : "No test! Enjoy :)"}`}
                </Alert>
            </Collapse>
            <div style={{ "display": "flex", "flexDirection": "row", "justifyContent": "center", "padding": "20px" }}>
                {loaded === true ? (
                    <div style={{ "marginTop": "20px" }}>
                        <div style={{ "marginRight": "20px", "position": "sticky", "top": "5%" }}>
                            <Stepper nonLinear className={classes.stepper} activeStep={activeStep} orientation="vertical">
                                {stepperContent.map((step, index) => {
                                    return (
                                        <Step >
                                            <StepLabel>
                                                <StepButton component={HashLink} to={"#" + index}>
                                                    {step}
                                                </StepButton>
                                            </StepLabel>
                                        </Step>
                                    )
                                })}
                            </Stepper>
                        </div>
                    </div>) : <></>}
                <div style={{ "width": "fit-content" }}>
                    {content}
                </div>
            </div>
        </div>
    )
}
