import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import { Alert } from '@mui/material';
import axios from 'axios';
import React from 'react'

export default function Admin() {
    const [batches, setBatches] = React.useState({});
    const [checked, setChecked] = React.useState({});
    const [response, setResponse] = React.useState(0);

    React.useEffect(() => {
        if (Object.keys(batches).length < 1) {
            axios({
                url: 'https://dev.langvocab.xyz/batches',
                method: 'post'
            })
                .then(res => {
                    let initialCheckedState = {};
                    for (let i in res.data.batches) {
                        initialCheckedState[i] = {};
                        res.data.batches[i].forEach(el => {
                            initialCheckedState[i][el] = false;
                        })
                    }
                    setChecked(initialCheckedState);
                    setBatches(res.data.batches);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [])

    const handleChange = (event) => {
        let shallowCopy = checked;
        let keys = (event.target.id).split(',');
        shallowCopy[keys[0]][keys[1]] = event.target.checked;
        setChecked(shallowCopy);
    }

    const handleSubmit = () => {
        let changes = {};
        for (let i in checked) {
            const checkedBatches = [];
            for (let o in checked[i]) {
                if (checked[i][o] === true) checkedBatches.push(o);
            }
            if (checkedBatches.length > 0) {
                changes[i] = checkedBatches;
            }
        }
        if (Object.keys(changes).length > 0 && localStorage.getItem('authorized') === 'true') {
            axios.post('https://dev.langvocab.xyz/setbounty', changes)
                .then(res => {
                    setResponse(1);
                })
                .catch(err => {
                    console.log(err);
                    setResponse(2);
                })
        } else setResponse(2);
    }

    const mapBatches = () => {
        let mappedComponents = [];
        for (let i in batches) {
            const temp = []
            batches[i].forEach(el => {
                temp.push(<FormControlLabel control={<Checkbox onChange={handleChange} id={`${i.toString()},${el.toString()}`} />} label={el} />)
            })
            mappedComponents.push(
                <FormControl component="fieldset">
                    <FormGroup>
                        <Typography>{i.toUpperCase()}</Typography>
                        {temp}
                    </FormGroup>
                </FormControl>
            )
        }
        return mappedComponents;
    }
    const batchCheckBoxes = mapBatches();

    return (
        <div>
            <Typography variant="h3">Select batches that are on next test. Yes its rough but I don't care it doesn't need to be pretty</Typography>
            <div style={{ "display": "flex", "flexDirection": "row" }}>
                {batchCheckBoxes}
                <div style={{ width: "20%" }}>
                    {response !== 0 ? <Alert severity={response === 2 ? "error" : "success"}>{response === 2 ? "Submission failed, you either hadn't selected any batch or there has been a server error" : "Submission successful"}</Alert> : <></>}
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    )
}
