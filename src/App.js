import './App.css';
import { Table } from './components/Table';

function App() {
  return (
    <div style={{ width: 'max-content' }}>
      <Table rows={10} columns={10} />
    </div>
  );
}

export default App;
