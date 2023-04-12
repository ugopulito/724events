import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import "./style.scss"

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState({});
  useEffect(() =>{
    api.loadData()
    .then(response => {
      setData(response);
      setLast(response.events.sort((evtA, evtB) =>
      new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
      )[0])
    })
    .catch(err => setError(err))
  }, [data])

  if(!data){
    return <div className="loader">Chargement</div>
  }
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
