import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { createTheme, Typography } from '@mui/material';

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

export default function WordTable({ vocab }) {

    const createRows = () => {
        const returnThis = [];
        if (vocab && Object.keys(vocab).length > 0) {
            for (let i in vocab) {
                let first = true;
                for (let el in vocab[i]) {
                    if (first === true) {
                        returnThis.push(
                            <TableRow>
                                <TableCell ><Typography variant="h6">{i}</Typography></TableCell>
                                <TableCell align="left"><Typography variant="h6">{el}</Typography></TableCell>
                                <TableCell align="left"><Typography variant="h6">{vocab[i][el]}</Typography></TableCell>
                            </TableRow>
                        )
                        first = false;
                    } else {
                        returnThis.push(
                            <TableRow>
                                <TableCell ></TableCell>
                                <TableCell align="left"><Typography variant="h6">{el}</Typography></TableCell>
                                <TableCell align="left"><Typography variant="h6">{vocab[i][el]}</Typography></TableCell>
                            </TableRow>
                        )
                    }
                }
            }
        }
        return returnThis;
    }
    const rows = createRows();
    return (
        <TableContainer component={Paper}>
            <Table theme={theme} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6">Date</Typography></TableCell>
                        <TableCell align="left"><Typography variant="h6">English</Typography></TableCell>
                        <TableCell align="left"><Typography variant="h6">Czech</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
