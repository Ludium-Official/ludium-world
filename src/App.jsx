import "./App.css";

const CLIENT_ID = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_OAUTH2_GOOGLE_REDIRECT_URI;
const RESPONSE_TYPE = process.env.REACT_APP_OAUTH2_GOOGLE_RESPONSE_TYPE;
const SCOPE = process.env.REACT_APP_OAUTH2_GOOGLE_SCOPE;

function App() {
  return <div className="App">
    <div className="ButtonArea">
    <a className="LoginBtn" href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Google Login</a>
      <button className="ArticleBtn">articles</button>
    </div>
  </div>;
}

export default App;
