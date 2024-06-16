import {Link} from 'react-router-dom'

const Pagination = (props) => {

    const pages = [];
    const url = props.url
    const currentPage = props.currentPage
    const lastPage = props.totalPages
    const search = props.search
    for (let i = 1; i <= props.totalPages; i++) {
        pages.push(
        <li key={i} className={currentPage == i ? 'page-item active' : 'page-item'}>
            <Link to={`/Ql/${url}?page=${i}&search=${search}`} className="page-link">
                {i}
            </Link>
        </li>
        );
    }
    
    return (
        <div className='d-flex j-center'>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
                        <Link 
                            to={`/Ql/${url}?page=${parseInt(currentPage) - 1}&search=${search}`}
                            className="page-link"
                        >
                            &lt;
                        </Link>
                    </li>
                    {pages}
                    <li className={currentPage == lastPage ? 'page-item disabled' : 'page-item'}>
                        <Link 
                            to={`/Ql/${url}?page=${parseInt(currentPage) + 1}&search=${search}`}
                            className="page-link"
                        >
                            &gt;
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination;