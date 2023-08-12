import './App.css';
import './styles/global.css';
import { BrowserRouter} from 'react-router-dom';
import { useState, useEffect, createContext, useRef } from 'react';
import EditorScreen from './editor/TableDragging';

//import Menu from './misc/DevMenu';
// import Login from './pages/Login';
// import Home from './pages/Home';
// import Event from './pages/Event';
// import CreateEvent from './pages/EventFactory';


interface Dimension {
  width: number,
  height: number
}

export const headerContext = createContext<Dimension>({width: 0, height: 0});
export const containerContext = createContext<DOMRect | null>(null);

function App() {
  // const [eventData, setEventData] = useState([]);
  // const [layoutData, setLayoutData] = useState([]);
  
  const [headerDim, setHeaderDim] = useState<Dimension>({width: 0, height: 0});
  const [containerDim, setContainerDim] = useState<DOMRect | null>(null);
  // const [presetData, setPresetData] = useState([]);
  
  const headerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | number>(0);

  useEffect(() => {
    const updateSize = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const height = rect.top >= 0 && rect.bottom <= window.innerHeight ? rect.height : 0;
        setHeaderDim({width: rect.width, height: height});
      }
      if (containerRef.current) {
        if (containerRef.current instanceof HTMLDivElement) {
          const containerRect = containerRef.current.getBoundingClientRect();
          setContainerDim(containerRect);
        }
        
      }
    }
    window.addEventListener('resize', updateSize);
    window.addEventListener('scroll', updateSize);
    updateSize();
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', updateSize);
    }
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const height = rect.top >= 0 && rect.bottom <= window.innerHeight ? rect.height : 0;
        setHeaderDim({width: rect.width, height});
      }
      if (containerRef.current && containerRef.current instanceof HTMLDivElement) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setContainerDim(containerRect);
      }
    }
    window.addEventListener('resize', updateSize);
    window.addEventListener('scroll', updateSize);
    updateSize();
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', updateSize);
    }
  }, []);

  // useEffect(() => {
  //   const updateSize = () => {

  //     if (headerRef.current) {
  //       const rect = headerRef.current.getBoundingClientRect();
  //       const height = rect.top >= 0 && rect.bottom <= window.innerHeight ? rect.height : 0;
  //       setHeaderDim({width: rect.width, height});
  //     }
  //     if (containerRef.current && containerRef.current instanceof HTMLDivElement) {
  //       const containerRect = containerRef.current.getBoundingClientRect();
  //       setContainerDim(containerRect);
  //   }

  //   window.addEventListener('resize', updateSize);
  //   window.addEventListener('scroll', updateSize);
  //   updateSize();
  //   return () => {
  //     window.removeEventListener('resize', updateSize);
  //     window.removeEventListener('scroll', updateSize);
  //   }
  // }}, []);

  return (
    <BrowserRouter>
      <div className="outer-container">
        <headerContext.Provider value={headerDim}>
          <containerContext.Provider value={containerDim}>          
            <div ref={headerRef} className='header'>
              <h2 className='header_text'>Editor Panel</h2>
            </div>
            <EditorScreen />
          </containerContext.Provider>
        </headerContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;