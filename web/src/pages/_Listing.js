import React, { useEffect } from 'react'
import { AppBar, Collapse, FormControl, IconButton, InputLabel, NativeSelect, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar } from '@material-ui/core'
import axios from 'axios';
import { Alert, createTheme, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const theme = createTheme();

theme.typography.h6 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.4rem',
    },
};

export default function Navbar() {
    const [languages, setLanguages] = React.useState([]);
    const [batches, setBatches] = React.useState({});
    const [selection, setSelection] = React.useState({ "language": "aj", "batch": "I" });
    const [vocab, setVocab] = React.useState({});
    const [vocabCache, setVocabCache] = React.useState([]);
    const [bounty, setBounty] = React.useState({});
    const [open, setOpen] = React.useState(true);

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

    useEffect(() => {
        if (Object.keys(vocab).length < 1) {
            axios.post(`https://dev.langvocab.xyz/vocab`, { lang: "aj" })
                .then(res => {
                    setVocabCache(["aj"]);
                    setVocab({ "aj": res.data });
                })
                .catch(err => {
                    console.error(err);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (languages.length === 0) {
            axios({
                url: 'https://dev.langvocab.xyz/languages',
                method: 'post',
            })
                .then(res => {
                    setLanguages(res.data.languages);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [languages])

    useEffect(() => {
        if (Object.keys(batches).length === 0) {
            axios({
                url: 'https://dev.langvocab.xyz/batches',
                method: 'post'
            })
                .then(res => {
                    setBatches(res.data.batches);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [batches])

    const createRows = () => {
        const returnThis = [];
        if (vocab && Object.keys(vocab).length > 0 && Object.keys(vocab).includes(selection.language)) {
            for (let i in vocab[selection.language][selection.batch]) {
                for (let el in vocab[selection.language][selection.batch][i]) {
                    returnThis.push(
                        <TableRow style={{width: "100vw"}}>
                            <TableCell align="left"><Typography>{el}</Typography></TableCell>
                            <TableCell align="left"><Typography>{vocab[selection.language][selection.batch][i][el]}</Typography></TableCell>
                        </TableRow>
                    )
                }
            }
        }
        return returnThis;
    }

    const createBatchOptions = () => {
        if (Object.keys(batches).length > 0) {
            return batches[selection.language].map(el => <option value={el}>{el}</option>);
        } else {
            return <option value={"rip"}>RIP</option>
        }
    }

    const rows = createRows();
    const batchOptions = createBatchOptions();

    const handleLangugeChange = (newValue) => {
        const newSelection = {
            language: newValue,
            batch: batches[newValue][0]
        };
        populateVocab(newValue);
        setSelection(newSelection);
        setOpen(true);
    }

    const handleBatchChange = (newValue) => {
        const newSelection = {
            language: selection.language,
            batch: newValue
        };
        setSelection(newSelection);
    }

    /**
     * I HAVE NO IDEA WHY THE EFFECT HOOK WASN'T WORKING IN THIS CASE, but I am way too goshdarn tired
     * to deal with it so here we borderline abuse the state by making a deepcopy adding the value and
     * then just suppling that to state. DO NOT DO THIS
     * 
     * @param {*} addThisLang 
     */
    const populateVocab = (addThisLang) => {
        if (vocabCache.includes(addThisLang) === false) {
            axios.post(`https://dev.langvocab.xyz/vocab`, { lang: addThisLang })
                .then(res => {
                    let temp = vocabCache;
                    temp.push(addThisLang);
                    setVocabCache(temp);
                    let deepCopy = JSON.parse(JSON.stringify(vocab));
                    deepCopy[addThisLang] = res.data;
                    setVocab(deepCopy);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Language
                        </InputLabel>
                        <NativeSelect
                            inputProps={{
                                name: 'language',
                                id: 'uncontrolled-native',
                            }}
                            value={selection.language}
                            onChange={(event) => handleLangugeChange(event.target.value)}
                        >
                            {languages.length > 0 ? (languages.map(el => <option value={el}>{el.toUpperCase()}</option>)) : (<option value={"rip"}>RIP</option>)}
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Batch
                        </InputLabel>
                        <NativeSelect
                            inputProps={{
                                name: 'batch',
                                id: 'uncontrolled-native',
                            }}
                            value={selection.batch}
                            onChange={(event) => handleBatchChange(event.target.value)}
                        >
                            {batchOptions}
                        </NativeSelect>
                    </FormControl>
                </Toolbar>
            </AppBar>
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
                    {`${bounty && Object.keys(bounty).length > 0 && Object.keys(bounty).includes(selection.language) ? `Next test from batches: ${(bounty[selection.language]).join(', ')}. Good luck!` : "No test! Enjoy :)"}`}
                </Alert>
            </Collapse>
            <TableContainer component={Paper}>
                <Table theme={theme} size="small" aria-label="a dense table" style={{width: "100vw"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><Typography variant="h6">{selection.language === "aj" ? "English" : "German"}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="h6">Czech</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
