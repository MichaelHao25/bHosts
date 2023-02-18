import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SingleHost from './pages/SingleHost';

export default () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SingleHost />} />
      </Routes>
    </Router>
  );
};
