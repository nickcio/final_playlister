import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import { TextField } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

const size = {
    transform:"scale(1.8)",
    marginRight:'40px'
}

const textF = {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:"white",
    borderRadius:3,
    color:'grey',
    maxHeight:'50%'
}

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [anchorSortEl, setAnchorSortEl] = useState(null);
    const isSortOpen = Boolean(anchorSortEl);
    const inHome = Boolean(store.isInHome());

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortMenuOpen = (event) => {
        setAnchorSortEl(event.currentTarget);
    }

    const handleSortMenuClose = () => {
        setAnchorSortEl(null);
    };

    const handleSortName = () => {
        console.log("SET TO NAME")
        handleSortMenuClose();
        store.setSortType(0);
    }

    const handleSortDate = () => {
        handleSortMenuClose();
        store.setSortType(1);
    }

    const handleSortListen = () => {
        handleSortMenuClose();
        store.setSortType(2);
    }

    const handleSortLike = () => {
        handleSortMenuClose();
        store.setSortType(3);
    }

    const handleSortDislike = () => {
        handleSortMenuClose();
        store.setSortType(4);
    }

    const handleSortCreated = () => {
        handleSortMenuClose();
        store.setSortType(5);
    }

    const handleSortEdited = () => {
        handleSortMenuClose();
        store.setSortType(6);
    }

    const handleLogout = () => {
        handleMenuClose();
        store.closeCurrentList();
        store.clearTransactions();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    const sortMenuId = "sort-menu"
    const sortMenuLists =
        <Menu
            anchorEl={anchorSortEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={sortMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            style={{
                transform: 'translateY(5%)'
            }}
            open={isSortOpen}
            onClose={handleSortMenuClose}
        >
            <MenuItem onClick={handleSortName}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortDate}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleSortListen}>Listens (High-Low)</MenuItem>
            <MenuItem onClick={handleSortLike}>Likes (High-Low)</MenuItem>
            <MenuItem onClick={handleSortDislike}>Dislikes (High-Low)</MenuItem>
        </Menu>
    const sortMenuHome = 
            <Menu
            anchorEl={anchorSortEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={sortMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            style={{
                transform: 'translateY(5%)'
            }}
            open={isSortOpen}
            onClose={handleSortMenuClose}
        >
            <MenuItem onClick={handleSortName}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortCreated}>Creation Date (Old-New)</MenuItem>
            <MenuItem onClick={handleSortEdited}>Last Edit Date (New-Old)</MenuItem>
        </Menu>
    let sortMenu = sortMenuLists
    if(inHome) {
        sortMenu = sortMenuHome
    }


    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    let wholeBanner = "";
    if (auth.loggedIn) {
        wholeBanner = <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography                        
                    variant="h4"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}                        
                >
                    Playlister
                </Typography>
                <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        { getAccountMenu(auth.loggedIn) }
                    </IconButton>
                </Box>
            </Toolbar>
            <Toolbar
            style={{backgroundColor: 'black'}}
            >
                <Box>
                    <HomeIcon sx={size}/>
                </Box>
                <Box>
                    <GroupsIcon sx={size}/>
                </Box>
                <Box>
                    <PersonIcon sx={size}/>
                </Box>
                <TextField style={textF} label="Search" fullWidth>
                    Genus
                </TextField>
                <Box sx={{marginLeft:'50px', width:'50px'}}>
                    SORT BY
                </Box>
                <Box>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="sort menu"
                        aria-controls={sortMenuId}
                        aria-haspopup="true"
                        onClick={handleSortMenuOpen}
                        color="inherit"
                    >
                        <SortIcon sx={size}/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
        {
            menu
        }
        {
            sortMenu
        }
    </Box>;
    }

    return (
        <Box>
            {wholeBanner}
        </Box>
    );
}