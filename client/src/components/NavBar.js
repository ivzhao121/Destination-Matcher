import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, marginL, marginR, isMain }) => {
    return (
        <Typography
            variant={isMain ? 'h5' : 'h7'}
            noWrap
            style={{
                marginLeft: marginL,
                marginRight: marginR,
                fontFamily: 'Raleway',
                fontWeight: 700,
                letterSpacing: '.5rem',
            }}
        >
            <NavLink
                to={href}
                style={{
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                {text}
            </NavLink>
        </Typography>
    )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar style={{textAlign: 'center'}}>
                    <NavText href='/' text='DestinationMatcher' marginL='0px' mrginR='50px' isMain />
                    <NavText href='/flights' text='Flights' marginL='100px' mrginR='50px' />
                    <NavText href='/hotels' text='Hotels' marginL='100px' mrginR='50px' />
                    <NavText href='/survey' text='Survey'marginL='150px' mrginR='50px' />
                    <NavText href='/map' text='Map' marginL='150px' mrginR='40px'/>
                </Toolbar>
            </Container>
        </AppBar>
    );
}