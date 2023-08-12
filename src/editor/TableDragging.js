import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ObjectCollection from './EditorComponents/ObjectCollection';
//import DEFAULT_TABLE_DATA from './test-data/table_data.json';
import './EditorComponents/Table.css';
import TableManager from './EditorComponents/TableManager';
import { useEffect, useState, createContext, useContext, useRef } from 'react';
import ObjectDragLayer from './EditorComponents/DragLayer/TableDragLayer';
import { containerContext } from '../App';

export const EditorOffset = createContext(null);
export const PaddingOffset = createContext(null);

/**
 * Provides the Offset values of the Table Editor components
 * @param {object} children :- Passes child values down the tree 
 * @returns 
 */
const EditorOffestProvider = ({ children }) => {
  const [offset, setOffset] = useState({offsetX: 0, offsetY: 0});

  const updateOffset = (offset) => {
    setOffset(offset);
  }

  return (
    <EditorOffset.Provider value={{offset, updateOffset}}>
      {children}
    </EditorOffset.Provider>
  );
}


const EditorScreen = ({layoutInfo=null}) => {
  const [layoutData, setLayoutData] = useState([]);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [photoUrls, setPhotoURLs] = useState([]);
  const [photoNames, setPhotoNames] = useState([]);
  const [objectInfo, setObjectInfo] = useState([]);
  const [floorplan, setFloorPlan] = useState(null);
  const [paddingOffset, setPaddingOffset] = useState(0);

  const outerContainerRect = useContext(containerContext);
  const editorRef = useRef(null);

  // Hook to find the difference in padding height
  useEffect(() => {
    if (editorRef.current && outerContainerRect) {
      const rect = editorRef.current.getBoundingClientRect();
      const floorHeight = rect.top >= 0 && rect.bottom <= window.innerHeight ? rect.height : 0;
      const outerHeight = outerContainerRect.top >= 0 && outerContainerRect.bottom <= window.innerHeight ? outerContainerRect.height : 0;
      const offset = (outerHeight - floorHeight)/2
      // The padding offset is the height of the floor plan minus the height of the outer container
      setPaddingOffset(offset >= 0 ? offset : 0);
      console.log("Padding offset is: ", offset);
    }
  }, [outerContainerRect])

  // // Fetch Layout Images from the database
  // // TODO: Uncomment this code, currently 
  // useEffect(() => {
  //   const fetchPhoto = async () =>  {
  //     const [names, urls] = await FetchPhotoURL('floors');
  //     if (names) {
  //       setPhotoNames(names);
  //     }
  //     if (urls) {
  //       setPhotoURLs(urls);
  //     } 
  //   }
  //   fetchPhoto();
  // }, []);

  // Set current layout
  useEffect(() => {
    if (currentLayout) {
      setObjectInfo(currentLayout['object-data']);
      setFloorPlan(currentLayout['floorplan']);
    }
  }, [currentLayout]);

  // Retrieve data from the database
  // const onDataRetrieved = (data) => {
  //   setLayoutData(data);
  //   setCurrentLayout(data[0]);
  // };

  const changeLayout = (index) => {
    if (layoutData && index < layoutData.length) {
      setCurrentLayout(layoutData[index]);
    }
  };

  /**Changes the floor plan (either Casa Loma or Liberty Grand) */
  const changeFlooring = (index) => {
    if (photoUrls && index < photoUrls.length) {
      setFloorPlan(photoUrls[index]);
      console.log(floorplan);
    }
  };

  /**Gets the current date to be uploaded in the form yyyy-mm-dd */
  const getCurrentDate = () => {
    const date = new Date();
  
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() returns month index starting from 0
    let day = date.getDate();
  
    // add leading zeros to the month and day if necessary
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
  
    return `${year}-${month}-${day}`;
  }

  const uploadFloorPlan = (objectData) => {
    // const data = {
    //   'dateCreated': getCurrentDate(),
    //   'name': 'Example Name',
    //   'venue': "Liberty Grand",
    //   'object-data': objectData,
    // };
  };

  /**Collection of callbacks and variables to be used for layout modification */
  const layCollection = {
    changeLayout, 
    uploadFloorPlan, 
    changeFlooring, 
    floorplan, 
    photoUrls, 
    photoNames
  };

  return (
    <div className="floorplan-editor" ref={editorRef}>
      { (
        <DndProvider backend={HTML5Backend}>
          <EditorOffestProvider>  
            <PaddingOffset.Provider value={paddingOffset}>
              {/* Object Collection extends all object/table info to the dropzone and editor panel */}
              <ObjectCollection objectInfo={objectInfo}>
                {(objCollection) => (
                  <div className="table-manager-screen">
                    <TableManager objCollection={objCollection} layCollection={layCollection}/>
                    <div style={{bottom: 0}} />
                  </div>
                )}
              </ObjectCollection>
              <ObjectDragLayer />
            </PaddingOffset.Provider>   
          </EditorOffestProvider>  
       </DndProvider>
      )}
    </div>
  );
};

export default EditorScreen;
