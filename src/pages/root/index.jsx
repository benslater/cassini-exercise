import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  AppBar as MaterialAppBar,
  Toolbar,
  IconButton,
  Typography,
  styled,
  ListItemIcon,
  Button,
  Popover,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useLoaderData,
  Link,
  Form,
  useSubmit,
  useLocation,
} from "react-router-dom";
import { Menu, ChevronLeft, AddCircle } from "@mui/icons-material";

const DRAWER_WIDTH = 300;
const HEADER_HEIGHT = 65;

export const rootLoader = async ({ request }) => {
  const response = await fetch("https://fakestoreapi.com/products");
  const items = await response.json();

  const url = new URL(request.url);
  const filters = url.searchParams.get("filters");

  return { items, filters };
};

const boxSx = {
  display: "flex",
};

const drawerSx = {
  width: DRAWER_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
  },
};

const AppBar = styled(MaterialAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  height: HEADER_HEIGHT,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  padding: 2,
  justifyContent: "flex-end",
}));

const RootPage = () => {
  const { items, filters } = useLoaderData();
  const submit = useSubmit();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const popoverButtonRef = useRef();

  const [selectedFilters, setSelectedFilters] = useState({});

  const filterQueryString = JSON.stringify(Object.keys(selectedFilters));
  // TODO: improve
  const availableFilters = Object.keys(
    items.reduce((acc, item) => ({ ...acc, [item.category]: true }), {})
  );

  useEffect(() => {
    const formData = new FormData();
    const URLQueryString = encodeURIComponent(Object.keys(selectedFilters));
    formData.append("filters", URLQueryString);

    // I can't find anything in the docs about getting this to submit to the current
    // path rather than '/'. As-is this causes the currently selected item to deselect
    // when the filters are changed. Didn't want to spend too much time on this.
    submit(formData);
  }, [filterQueryString]);

  useEffect(() => {
    const decodedFilterString = decodeURIComponent(filters);
    if (decodedFilterString === "null") return;

    const newFilters = decodedFilterString
      .split(",")
      .reduce((acc, filter) => ({ ...acc, [filter]: true }), {});
    setSelectedFilters(newFilters);
  }, []);

  return (
    <Box height="100vh" width="100vh" sx={boxSx}>
      <AppBar position="fixed" open={isDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setIsDrawerOpen((open) => !open)}
            edge="start"
            sx={{ mr: 2, ...(isDrawerOpen && { display: "none" }) }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Shop management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="persistent"
        open={isDrawerOpen}
        hideBackdrop
        sx={drawerSx}
      >
        <DrawerHeader>
          <IconButton onClick={() => setIsDrawerOpen((open) => !open)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Button
          ref={popoverButtonRef}
          aria-describedby="popover"
          variant="contained"
          onClick={() => setIsPopoverOpen((open) => !open)}
        >
          Filter items
        </Button>
        <Popover
          id="popover"
          open={isPopoverOpen}
          anchorEl={popoverButtonRef.current}
          onClose={() => setIsPopoverOpen((open) => !open)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Form role="search">
            <List>
              {availableFilters.map((filter) => {
                return (
                  <ListItem key={`filter-item-${filter}`}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={filter}
                          value={filter}
                          checked={selectedFilters[filter]}
                          onChange={(event) => {
                            if (selectedFilters[event.target.value]) {
                              setSelectedFilters((selected) => {
                                const newSelected = { ...selected };
                                delete newSelected[event.target.value];
                                return newSelected;
                              });
                            } else {
                              if (event.target.value) {
                                setSelectedFilters((selected) => ({
                                  ...selected,
                                  [event.target.value]: true,
                                }));
                              }
                            }
                          }}
                        />
                      }
                      label={filter}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Form>
        </Popover>
        <List dense aria-label="list of items">
          <Link to={`/item/new`}>
            <ListItem>
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary="Add item" />
            </ListItem>
          </Link>
          {items
            .filter((item) => selectedFilters[item.category])
            .map((item) => (
              <Link
                key={`item-${item.id}`}
                to={`/item/${item.id}${location.search}`}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={item.image} />
                  </ListItemAvatar>
                  <ListItemText primary={item.title} />
                </ListItem>
              </Link>
            ))}
        </List>
      </Drawer>
      <Box mt={`${HEADER_HEIGHT}px`}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default RootPage;
