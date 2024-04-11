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
        </div>
      </GlobalStyle>
  );
}

export default App;
