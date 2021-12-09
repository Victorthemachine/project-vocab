import React, { useEffect } from 'react'
import { AppBar, Avatar, Badge, makeStyles, Toolbar, Typography } from '@material-ui/core'
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: 22,
        height: 22,
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);

export default function Navbar() {
    const [userInfo, setUserInfo] = React.useState({});
    const [signedIn, setSignedIn] = React.useState(false);
    const classes = useStyles();

    useEffect(() => {
        axios.post('https://dev.langvocab.xyz/verify', {}, { timeout: 5000 })
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('name', res.data.name);
                    localStorage.setItem('pictureUrl', res.data.picture);
                    localStorage.setItem('authorized', res.data.authorized);
                    setUserInfo({
                        name: res.data.name,
                        pictureUrl: res.data.picture,
                        authorized: res.data.authorized
                    })
                    setSignedIn(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const handleLogin = async googleData => {
        axios({
            url: 'https://dev.langvocab.xyz/auth',
            method: 'post',
            data: { token: googleData.tokenObj.id_token },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 201) {
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('pictureUrl', res.data.picture);
                localStorage.setItem('authorized', res.data.authorized);
                setUserInfo({
                    name: res.data.name,
                    pictureUrl: res.data.picture,
                    authorized: res.data.authorized
                })
                setSignedIn(true);
            }
        }).catch(err => {
            console.log(err);
        })
        // store returned user somehow
    }

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Vocabulary von Lang
                    </Typography>
                    {!signedIn ? <GoogleLogin
                        clientId={'239077402357-t53i96eiq8rqug6ma63kb82k18j131u1.apps.googleusercontent.com'}
                        buttonText="Log in with Google"
                        onSuccess={handleLogin}
                        cookiePolicy={'single_host_origin'}
                    /> :
                        <Badge badgeContent={<SmallAvatar src={'https://dev.langvocab.xyz/images/crownbadge.jpg'}
                            anchororigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            alt="admin" />}
                        >
                            <Avatar alt="profile picture" src={userInfo.pictureUrl} />
                        </Badge>}
                </Toolbar>
            </AppBar>
        </>
    )
}
