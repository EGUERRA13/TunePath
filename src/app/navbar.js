
import { NavLink } from 'react-router-dom'
import styles from "./page.module.css";
import logo from './tplogov1.png'
import Image from 'next/image'


const Navbar = () => {
    return (
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Image src={logo} width={50} alt="TP logo" />
          </div>
          <div className={styles.navelements}>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/Image To Music">Image To Music</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
  
  export default Navbar