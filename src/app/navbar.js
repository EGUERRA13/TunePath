
import Link from 'next/link'
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
                <Link href="/">Discography Flowchart</Link>
              </li>
              <li>
                <Link href="/imagetomusic">Image To Music</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
  
  export default Navbar