import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Toolbar, List, CssBaseline, Typography, Divider, IconButton } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons/lib";
import { isAuth, Signout } from "../helpers/auth";

const drawerWidth = 260;
const closedDrawerWidth = 60;

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

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const [sidebar, setSidebar] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const showDropdown = () => {
        setDropdown(!dropdown);
    };

    const logOut = () => {
        Signout();
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar disableGutters>
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
                            <ChevronLeftIcon />
                        </IconButton>
                    </Box>

                    <Stack direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%" >

                        <a href="/">
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box className="font-title font-regular text-xl md:text-3xl">
                                    DEFINE
                                </Box>
                                <Box className="font-body font-semibold  text-sm md:text-base">
                                    DESIGN FOR NET ZERO AND HEALTHY BUILDING
                                </Box>
                            </Stack>
                        </a>

                        <div className="navbar-right flex-row items-center justify-end mr-10">
                            <div className="flex-col">
                                {!isAuth() ? (
                                    <a class="navbar-brand-right" href="/login">
                                        Sign in
                                    </a>
                                ) : (
                                    <div>
                                        <h4
                                            class="navbar-brand-right font-body text-left justify-start"
                                            href="/login"
                                        >
                                            {isAuth().name}
                                        </h4>
                                        <h4 className="navbar-brand-right font-body font-light text-left justify-start">
                                            {isAuth().email}
                                        </h4>
                                    </div>
                                )}
                            </div>
                            <div className="flex-row items-center ml-5">
                                <Link to="#" onClick={showDropdown}>
                                    <FaIcons.FaChevronDown />
                                </Link>
                            </div>
                            <div
                                className={
                                    dropdown
                                        ? "flex justify-end bg-white mt-0 transition duration-500 absolute w-52 top-20 h-10 items-center"
                                        : "-mt-100 transition duration-500"
                                }
                            >
                                <span
                                    className={
                                        dropdown
                                            ? "font-body font-bold text-red-600 mr-2 items-center"
                                            : "hidden"
                                    }
                                >
                                    <FaIcons.FaArrowAltCircleRight color="red" />
                                </span>
                                <span
                                    className={
                                        dropdown
                                            ? "font-body font-bold text-red-600 items-center mr-10"
                                            : "hidden"
                                    }
                                >
                                    <Link to="/login" onClick={logOut}>
                                        LOG OUT
                                    </Link>
                                </span>
                                <div className={
                                    dropdown
                                        ? "bg-antiqueBrass w-4 h-full"
                                        : "hidden"
                                } />
                            </div>
                        </div>

                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open} PaperProps={{
                elevation: 3,
                sx: {
                    borderWidth: 0,
                }
            }}>
                <Box width="100%" height={50} display="flex" justifyContent="center" alignItems="center" sx={{ zIndex: "10", height: 50 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{
                            mx: "auto",
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
                    zIndex: 1, marginTop: -4,
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
                    <Box className="font-title font-regular text-xl md:text-3xl">
                        DEFINE
                    </Box>
                    <Box component="div" className="font-body font-semibold text-sm md:text-base" sx={{ whiteSpace: 'normal' }}>
                        DESIGN FOR NET ZERO AND HEALTHY BUILDING
                    </Box>
                </Stack>

                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send emaileeeeeeeedsfds', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText sx={{ whiteSpace: 'normal' }} primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

