import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Toolbar, List, Typography, Divider, IconButton, ThemeProvider, Menu, MenuItem, ListItem, ListItemText, ListItemIcon, Popper, Paper, ClickAwayListener, Button, Grow, MenuList } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { isAuth, Signout } from "../helpers/auth";
import { formChapters } from "../datas/Datas"
import { theme } from "../assets/Theme"
import { useHistory } from "react-router";
import { Menu as MenuIcon, ChevronLeftRounded as ChevronLeft, KeyboardArrowDownRounded as KeyboardArrowDown, Home as HomeIcon, LogoutRounded } from '@mui/icons-material';

const drawerWidth = 260;
const closedDrawerWidth = 70;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: closedDrawerWidth,
    [theme.breakpoints.up('sm')]: {
        width: closedDrawerWidth,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer - 1,
    transition: theme.transitions.create(['width', 'margin', 'padding'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        paddingLeft: 0,
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function FormDrawer(props, redirect) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Navbar open={open} handleDrawerClose={handleDrawerClose} />
            <SideDrawer open={open} handleDrawerOpen={handleDrawerOpen} activeChapter={props.activeChapter} redirect={redirect} />
        </ThemeProvider>
    );
}

const Navbar = ({ open, handleDrawerClose }) => {

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed" open={open} sx={{ backgroundColor: "steelTeal"}} >
                <Toolbar disableGutters sx={{ backgroundColor: "steelTeal", paddingRight: 4 }}>
                    <Box sx={{
                        marginX: 2,
                        ...(open && {
                            width: 40,
                            transition: theme.transitions.create(['width'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        }),
                        ...(!open && {
                            width: closedDrawerWidth,
                            transition: theme.transitions.create(['width'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        }),
                    }}>
                        <IconButton onClick={handleDrawerClose}
                            sx={{
                                color: "white",

                            }}>
                            <ChevronLeft />
                        </IconButton>
                    </Box>

                    <Stack direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%" >
                        <Box sx={{
                            ...(open && {
                                opacity: 0,
                                transition: theme.transitions.create(['opacity'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }),
                            ...(!open && {
                                opacity: 100,
                                transition: theme.transitions.create(['opacity'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }),
                        }}>
                            <a href="/">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography sx={{
                                        fontFamily: "Libre Baskerville",
                                        fontSize: 24,
                                        fontWeight: "medium",
                                        color: "white",
                                        whiteSpace: "normal"
                                    }}>
                                        DEFINE
                                    </Typography>

                                    <Typography sx={{
                                        marginX: 2,
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: "medium",
                                        color: 'white',
                                        whiteSpace: "normal"
                                    }}>
                                        DESIGN FOR NET ZERO AND HEALTHY BUILDING
                                    </Typography>
                                </Stack>
                            </a>
                        </Box>


                        {!isAuth() ? (
                            <Button variant="outlined" href="/login" sx={{
                                borderColor: "white",
                                color: "white",
                                fontFamily: "Poppins",
                                fontSize: 14,
                                fontWeight: "semibold",
                            }}>
                                Sign in
                            </Button>
                        ) : (
                            <Stack direction="row" alignItems="right" spacing={2}>
                                <Stack direction="column" alignItems="left" spacing={0}>
                                    <Typography sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 14,
                                        fontWeight: "medium",
                                        color: 'white',
                                        whiteSpace: "normal"
                                    }}>
                                        {isAuth().name}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: "Poppins",
                                        fontSize: 12,
                                        fontWeight: "regular",
                                        color: "lavenderGray",
                                        whiteSpace: "normal"
                                    }}>
                                        {isAuth().email}
                                    </Typography>
                                </Stack>
                                <MenuListComposition />
                            </Stack>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

function MenuListComposition() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const history = useHistory();

    const redirectPage = (path) => {
        history.push(path);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const logOut = () => {
        redirectPage("/login")
        Signout();
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <IconButton
                ref={anchorRef}
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <KeyboardArrowDown sx={{ color: "white" }} />
            </IconButton>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: 'right top',
                        }}
                    >
                        <Paper sx={{ marginTop: 1, width: 200, maxWidth: '100%' }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem onClick={() => logOut()}>
                                        <ListItemIcon>
                                            <LogoutRounded fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Log out</ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

const SideDrawer = ({ open, handleDrawerOpen, activeChapter }) => {

    const history = useHistory();

    const redirectPage = (path) => {
        history.push(path);
    };

    const [, updateState] = React.useState();

    const forceUpdate = React.useCallback(() => updateState({}), []);

    function handleClick(index) {
        redirectPage(index)
        forceUpdate()
    }


    function checkStatus(chapter) {
        if (chapter === activeChapter) {
            return "active"
        } else if (chapter < activeChapter) {
            return "clickable"
        } else {
            return "disabled"
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Drawer variant="permanent" open={open} PaperProps={{
                elevation: 3,
                sx: {
                    borderWidth: 0,
                }
            }}>
                <Box width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ zIndex: "10", height: 50 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{
                            mx: "auto",
                            marginTop: 2,
                            ...(open && {
                                opacity: 0,
                                transition: theme.transitions.create(['opacity'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }),
                            ...(!open && {
                                opacity: 100,
                                transition: theme.transitions.create(['opacity'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Stack direction="column" width={drawerWidth} alignItems="center" textAlign="center" sx={{
                    zIndex: 1, marginTop: -4, marginBottom: 2,
                    ...(open && {
                        opacity: 100,
                        transition: theme.transitions.create(['opacity'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                    ...(!open && {
                        opacity: 0,
                        transition: theme.transitions.create(['opacity'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                }}>

                    <Typography sx={{
                        fontFamily: "Libre Baskerville",
                        fontSize: 30,
                        fontWeight: "bold",
                        color: "steelTeal",
                        whiteSpace: "normal"
                    }}>
                        DEFINE
                    </Typography>

                    <Typography sx={{
                        marginX: 2,
                        fontFamily: "Poppins",
                        fontSize: 14,
                        fontWeight: "medium",
                        color: 'coolGrey',
                        whiteSpace: "normal"
                    }}>
                        DESIGN FOR NET ZERO AND HEALTHY BUILDING
                    </Typography>
                </Stack>

                <BackToDashboard open={open} />

                <Divider />
                <List>
                    {formChapters.map((item, index) => (
                        <SidebarItem
                            chapter={item.chapter}
                            title={item.title}
                            open={open}
                            status={checkStatus(index + 1)}
                            onClickBtn={handleClick} />
                    ))}
                </List>
                <Divider />
            </Drawer>
        </ThemeProvider>
    )
}

const BackToDashboard = ({ open }) => {

    const history = useHistory();

    const redirectPage = (path) => {
        history.push(path);
    };

    const handleClick = () => {
        redirectPage("/")
    };

    return (
        <ThemeProvider theme={theme}>
            <ListItem disableGutters disablePadding sx={{ width: drawerWidth, cursor:'pointer' }} onClick={() => handleClick()} >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 1,
                    borderColor: 'purple',
                    padding: 1,
                    marginX: 1,
                    marginY: 0.5,
                    width: "100%"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                        minWidth: 40,
                        minHeight: 40,
                        borderRadius: 1,
                        fontSize: 20,
                        fontWeight: 500,
                        borderWidth: 2,
                        borderColor: "steelTeal",
                        ...(open && {
                            width: drawerWidth - 30,
                            transition: theme.transitions.create(['width'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        }),
                        ...(!open && {
                            width: 40,
                            transition: theme.transitions.create(['width'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        }),
                    }}>
                        {!open && <HomeIcon sx={{
                            margin: "auto",
                            color: "steelTeal"
                        }} />}

                        {open && <Box
                            sx={{
                                height: "100%",
                                width: drawerWidth - 30,
                                fontFamily: "Poppins",
                                color: "steelTeal",
                                fontSize: 14
                            }}>Back to Dashboard</Box>}


                    </Box>
                </Box>
            </ListItem>
        </ThemeProvider>
    )
}

const SidebarItem = ({ chapter, title, status, open, onClickBtn }) => {

    function boxColor() {
        switch (status) {
            case "active":
                return "antiqueBrass"
            case "clickable":
                return "steelTeal"
            case "disabled":
                return "lavenderGray"
            default:
                break;
        }
    }

    function secondaryColor() {
        switch (status) {
            case "active":
                return "floralWhite"
            case "clickable":
                return "mintCream"
            case "disabled":
                return "ghostWhite"
            default:
                break;
        }
    }

    const onClickSidebarItem = (index) => {
        if (status === "disabled") {
            return
        }
        onClickBtn(index)
    }

    return (
        <ThemeProvider theme={theme}>
            <ListItem disableGutters disablePadding sx={{ width: drawerWidth, cursor:'pointer' }} onClick={() => onClickSidebarItem(chapter)}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 1,
                    padding: 1,
                    marginX: 1,
                    marginY: 0.5,
                    width: "100%",
                    ...({
                        "&:hover": {
                            backgroundColor: (secondaryColor()),
                        }
                    })
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                            minWidth: 40,
                            minHeight: 40,
                            borderRadius: 1,
                            fontFamily: "Poppins",
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                            backgroundColor: (boxColor())
                        }}>
                            {chapter}
                        </Box>
                        <ListItemText
                            sx={{
                                whiteSpace: 'normal'
                            }}
                            primaryTypographyProps={{
                                fontFamily: "Poppins",
                                fontWeight: "medium",
                                color: (boxColor()),
                                fontSize: 14
                            }}
                            primary={title} />
                    </Stack>
                </Box>
            </ListItem>
        </ThemeProvider>
    )
}