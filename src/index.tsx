import ReactDOM from 'react-dom';
import Main from './main';
import './index.scss';

const App: React.FC = () => <Main />;

const app = document.getElementById('app');
ReactDOM.render(<App />, app);
