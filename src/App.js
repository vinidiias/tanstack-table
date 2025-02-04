import logo from './logo.svg';
import './App.css';
import BasicTable from './components/BasicTable';
import useMockData from './hooks/useMockData';
import { useMemo } from 'react';

function App() {
  const { data, error } = useMockData()

  const columns = useMemo(
    () => [
      {
        accessorKey: "name", // Accessor key for the "name" field
        header: "Name", // Column header
        filterFn: "includesString", // includesString for strings
      },
      {
        accessorKey: "category",
        header: "Category",
        filterFn: "includesString", // includesString for strings
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${info.getValue().toFixed(2)}`, // Format price as currency
        filterFn: "equals", // equal for numbers
      },
      {
        accessorKey: "inStock",
        header: "In Stock",
        filterFn: "includesString", // includesString for strings
      },
    ],
    []
  );

  if(error) return  <div>{error}</div>
  if(data.length === 0) return <div>Loading...</div>

  return <BasicTable data={data} columns={columns} pageSize={3} />
}

export default App;
