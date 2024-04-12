import './App.css';


import GlobalStyle from './component/GlobalStyle'
import Header from './layout/header/Header'
import Navbar from './layout/navbar/Navbar';

function App() {
  return (
      <GlobalStyle>
        <div className="App">
          <Header/>

          <div className='row content'>
            <Navbar />
          </div>
          
          <footer className="footer d-flex j-space-between">
              <div>
                <strong>Copyright &copy; 2024 <a href="/">Order</a>. </strong> 
                All rights reserved.
              </div>
              <div className="pull-right hidden-xs">
                  <b>Version </b> 
                  1.0.0
              </div>
          </footer>
        </div>
      </GlobalStyle>
  );
}

export default App;
