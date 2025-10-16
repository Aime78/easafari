import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const MyText = () => {
  const navigate = useNavigate();
  const render = false;

  const backHome = () => {
    navigate("/");
  };

  if (render) {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<h1>Sample</h1>}></Route>
          <Route path="/cash" element={<h1>Cash</h1>}></Route>
          <Route path="/honey" element={<h1>Honey</h1>}></Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <div>
      <button onClick={backHome}>Home</button>
      <ul>
        <li>
          <Link to="/Home">Home</Link>
        </li>
        <li>
          <Link to="/market">Market</Link>
        </li>
        <li>
          <Link to="/accomodations">Accomodations</Link>
        </li>
      </ul>
    </div>
  );
};

export default MyText;
