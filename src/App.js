
import './App.css';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from "react-router-dom";
import HomePage from './pages/home/HomePage';
import StudentPage from './pages/student/StudentPage';
import StudentDetail from './components/studentDetail/StudentDetail';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<HomePage/>}></Route>
          <Route path='/student' element={<StudentPage />}></Route>
          <Route path='/student-detail/:id' element={<StudentDetail/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
