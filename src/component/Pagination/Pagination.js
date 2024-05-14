import {Link} from 'react-router-dom'

const Pagination = (props) => {

    const pages = [];
    const currentPage = props.currentPage
    const lastPage = props.totalPages
    for (let i = 1; i <= props.totalPages; i++) {
        pages.push(
        <li key={i} class={currentPage == i ? 'page-item active' : 'page-item'}>
            <Link to={`/Ql/Action/Order?page=${i}`} className="page-link">
                {i}
            </Link>
        </li>
        );
    }
    
    return (
        <div className='d-flex j-center'>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
                        <Link 
                            to={`/Ql/Action/Order?page=${parseInt(currentPage) - 1}`}
                            className="page-link"
                        >
                            &laquo;
                        </Link>
                    </li>
                    {pages}
                    <li class={currentPage == lastPage ? 'page-item disabled' : 'page-item'}>
                        <Link 
                            to={`/Ql/Action/Order?page=${parseInt(currentPage) + 1}`}
                            className="page-link"
                        >
                            &raquo;
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination;