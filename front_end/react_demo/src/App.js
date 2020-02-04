// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage.jsx'
import LoginAndRegister from './components/LoginAndRegister/LoginAndRegister.jsx'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={LoginAndRegister}></Route>
          <Route path='/' component={MainPage}></Route>


        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
