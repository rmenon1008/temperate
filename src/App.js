import './App.css';
import Background from './components/Background/Background';
import Temperature from './components/Temperature/Temperature';
import { UserStorage } from './components/UserStorage/UserStorage';
import Links from './components/Links/Links';
import ContextMenu from './components/ContextMenu/ContextMenu';
import Popup from './components/Popup/Popup';
// import Options from './components/options/Options/Options';
import React, { lazy } from 'react';
const Options = lazy(() => import('./components/options/Options/Options'));


function App() {

  // const [userStorage, setUserStorage, isPersistent, error] = useChromeStorageSync();

  if (window.location.search.includes("?options")) {
    return (
      <div className="App App-options">
        <UserStorage>
          <Options />
        </UserStorage>
      </div>
    )
  } else if (window.location.search.includes("?popup")) {
    return (
      <div className="App App-popup">
        <UserStorage>
          <Popup />
        </UserStorage>
      </div>
    )
  }

  return (
    <div className="App App-newtab">
      <UserStorage>
        <Background />
        <Temperature />
        {/* <Widgets /> */}
        <Links />
        <ContextMenu />
      </UserStorage>
    </div>
  );
}

export default App;
