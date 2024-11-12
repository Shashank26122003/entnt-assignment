import { Link } from 'react-router-dom';
import './NavBar.css'


const NavBar = ()=>{
    return(
        <div className="navbar-main">
            <div>
                <a href="/"  style={{textDecoration: "none"}}><h1 className='navbar-heading'>ENTNT </h1></a>
            </div>
        </div>
    )
}

export {NavBar};