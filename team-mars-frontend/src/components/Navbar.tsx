import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="sticky top-0">
      <ul>
        <li>
          <Link to={'/'}>Home</Link>
        </li>
        <li>
          <Link to={'contact'}>Contact Us</Link>
        </li>

      </ul>
    </nav>
  )
}


export default Navbar;
