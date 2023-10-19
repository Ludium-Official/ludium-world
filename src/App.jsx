import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

const CLIENT_ID = process.env.REACT_APP_OAUTH2_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_OAUTH2_GOOGLE_REDIRECT_URI;
const RESPONSE_TYPE = process.env.REACT_APP_OAUTH2_GOOGLE_RESPONSE_TYPE;
const SCOPE = process.env.REACT_APP_OAUTH2_GOOGLE_SCOPE;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <div className="ButtonArea">
          <a className="LoginBtn" href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Google Login</a>
        </div>
      </div>
    )
  }, {
    path: "/main",
    element: (
      <div className="App">
        <div className="ButtonArea">
          <Link className="ArticleBtn" to={`/article`}>아티클</Link>
        </div>
      </div >
    )
  }, {
    path: "/article",
    element: (
      <div>
        <button>
        <Link to={`new`}>글쓰기</Link>
        </button>
        <div>
          글 목록 표시
        </div>
      </div>
    ),
  },
  {
    path: "/article/new",
    element: (
      <div>
        <button>업로드</button>
        <label htmlFor="title">제목</label>
        <input type="text" id="title" />
      </div>
    )
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
