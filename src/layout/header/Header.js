import clsx from 'clsx'
import styles from './header.module.scss';


function Header() {

    const classHeader = clsx(styles.header,'navbar navbar-expand-sm navbar-dark')

    return (
        <nav className={classHeader}>
            <div className="container-fluid">
            <a className="navbar-brand">Logo</a>
            <div className="collapse navbar-collapse j-flex-end">
                <div className="d-flex">
                <div className='btn btn-info d-flex'>
                    <img />
                    <div>Hồ Văn Tuyến</div>
                </div>
                <button className="btn btn-secondary" type="button">Đăng xuất</button>
                </div>
            </div>
            </div>
        </nav>
    )
}

export default Header