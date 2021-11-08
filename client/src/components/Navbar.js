import React, { useState } from "react";
import { isAuth, Signout } from "../helpers/auth";
import "./Navbar.css";
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, Stack, Toolbar, List, Typography, Divider, IconButton, ThemeProvider, Menu, MenuItem, ListItem, ListItemText, ListItemIcon, Popper, Paper, ClickAwayListener, Button, Grow, MenuList } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { formChapters } from "../datas/Datas"
import { theme } from "../assets/Theme"
import { useHistory } from "react-router";
import { Menu as MenuIcon, ChevronLeftRounded as ChevronLeft, KeyboardArrowDownRounded as KeyboardArrowDown, Home as HomeIcon, LogoutRounded } from '@mui/icons-material';


const Navbar = () => {

  return (
    <ThemeProvider theme={theme}>
        <AppBar position="fixed" >
            <Toolbar disableGutters sx={{ backgroundColor: "steelTeal", paddingX: 4 }}>
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%" >
                    <Box >
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
};

export default Navbar;

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
