import clsx from 'clsx'
import styles from './header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars} from '@fortawesome/free-solid-svg-icons'

function Header() {

    const classHeader = clsx(styles.header,'navbar navbar-expand-sm navbar-dark')

    return (
        <nav className={classHeader}>
            <div className="container-fluid logo">
                <a className="navbar-brand">Logo</a>
                <div className="collapse navbar-collapse j-flex-end">
                    <div className="d-flex">
                        <div className='btn btn-outline-info d-flex'>
                            <img />
                            <div>Hồ Văn Tuyến</div>
                        </div>
                        <button className="btn btn-outline-warning" type="button" style={{marginLeft:'4px'}}>Đăng xuất</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header