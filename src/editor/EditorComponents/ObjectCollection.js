import { useCallback, useEffect, useState, useRef } from 'react';
import './Table.css';
import { EditorComponentTypes } from './EditorPanel/EditorPanel';
import DEFAULT_TABLE_DATA from '../test-data/table_data.json';
import { ObjectTypes } from './TableComponents';
import { snapToGrid } from './DragLayer/TableDragLayer';

/** This component contains all Table/Object data to be used in the floorplan
* In order to add/remove or modify any objects in Floorplan it must be done through this component 
* @param {object} objectInfo: the current layout data for all objects
* @param {function} changeLayout: used to change the layout 
*/
const ObjectCollection = ({ children, objectInfo=[] }) => {
    const [objectData, setObjectData] = useState(objectInfo);           // Current object data
    const [loadedData, ] = useState([]);                                // Most recently saved object data (exists in the database)
    const [objectDataHistory, setObjectHistory] = useState([]);         // Stored data history (for undo functionality)
    const [objectDataRedoHistory, setObjectRedoHistory] = useState([]); // Stored data history (for redo functionality)
    const [tableIDs, setTableIDs] = useState([]);
    const nextTableID = useRef(1);

    const sortTables = (tableArr) => {
        const sortedTables = tableArr.sort((a, b) => {
            if (typeof a.tableID !== 'number') return -1;
            if (typeof b.tableID !== 'number') return 1;
            return a.tableID - b.tableID;
        });
        console.log("Sorted Tables: ", sortedTables);
        
        return sortedTables;
    };

    useEffect(() => {
        // Get all table ids found in the objectData
        const foundTableIDs = objectData.map(obj => obj.tableID).filter(val => typeof val === 'number');
        // Set all table IDs using a sorted version of the found table ids
        const sortedTableIDs = foundTableIDs.sort((a, b) => a - b);
        setTableIDs(sortedTableIDs);
    }, [objectData]);

    useEffect(() => {
        // Update nextTableID
        if (!tableIDs || tableIDs.length < 1 || tableIDs[0] !== 1) {
            console.log(`Table IDs is empty`);
            nextTableID.current = 1;
            console.log(`Next Table ID: `, nextTableID.current);
            return;
        }
        for (let i = 1; i < tableIDs.length; i++) {
            let prevId = tableIDs[i - 1];
            let curId = tableIDs[i];
            if (curId - prevId > 1) {
                nextTableID.current = prevId + 1;
                console.log(`Next Table ID: `, nextTableID.current);
                return;
            }
        }
        nextTableID.current = tableIDs[tableIDs.length - 1] + 1;
        //console.log(`Next Table ID: `, nextTableID.current);
    }, [tableIDs]);

    const addTable = (table) => {
        table.tableID = nextTableID.current;
        table.name = `Table ${nextTableID.current}`;
        const [x, y] = snapToGrid({x: table.position.x, y: table.position.y});
        table.position = {x, y};
        setObjectData((prevObjects) => {return sortTables([...prevObjects, table])});
    };

    // Resets object data to last state stored in the storage
    const resetObjectData = useCallback((setToDefault=false) => {
        // If data is corrupted, code will output an error message + set the data to the default configuration
        try {
            const savedObjectData = localStorage.getItem("objectData");
            if (!setToDefault && savedObjectData) {
                setObjectData(JSON.parse(savedObjectData));
            }
            else {
                setObjectData(loadedData);
            }
        } catch (error) {
            console.error(`Error loading data: `, error);
            setObjectData(DEFAULT_TABLE_DATA);
        }
    }, [loadedData]);// end resetObjectData()

    // If objectData is null then reset to last saved configuration (or default)
    useEffect(() => {
        if (objectData === null || objectData === '') {
            resetObjectData(false);
        }
    }, [objectData, resetObjectData]);// end useEffect()

    // Add key listener for undoing/redoing actions
    useEffect(() => {
        const undoAction = (e) => {
            // If undo key pressed
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                if (objectDataHistory.length > 0) {
                    // Update RedoHistory
                    setObjectRedoHistory(prevState => [...prevState, JSON.parse(JSON.stringify(objectData))]);
                    // Change object data to the second last recorded position
                    setObjectData(objectDataHistory[objectDataHistory.length - 2]);
                    // The last position is the current objectData so should be ignored
                    setObjectHistory(prevState => prevState.slice(0, -2));
                }
            }
            // If redo key pressed
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
                if (objectDataRedoHistory.length > 0) {
                    // Change Object data (will also update objectHistory due to hook)
                    setObjectData(objectDataRedoHistory[objectDataRedoHistory.length - 1]);
                    setObjectRedoHistory(prevState => prevState.slice(0, -1));
                }
            }
        };
        window.addEventListener('keydown', undoAction);
        return () => window.removeEventListener('keydown', undoAction);
    }, [objectDataHistory, objectDataRedoHistory, objectData]);

    /**  Saves objects to local storage */
    const saveObjectData = useCallback(() => {
        localStorage.setItem("objectData", JSON.stringify(objectData));
    }, [objectData]);

    // useEffect hook updates the object history every time objectData is updated
    useEffect(() => {
        if (objectData && objectData) {
            // Use JSON to create a deep copy of objectData when saving the history
            setObjectHistory(prevState => [...prevState, JSON.parse(JSON.stringify(objectData))]);
            saveObjectData();
        }
    }, [objectData, saveObjectData]);

    const clearAllObjectData = () => {
        setObjectData([]);
    };

    /**Adds a new object to the Editor */
    const addObject = (newObject) => {
        if (
            newObject &&
            newObject.type &&
            // Checks if The objects type is a valid type
            Object.values(ObjectTypes).includes(newObject.type) &&
            newObject.position &&
            typeof newObject.position.x === 'number' &&
            typeof newObject.position.y === 'number'
        ) {
            // Modify position
            setObjectData((prevObjectData) => [...prevObjectData, newObject]);
        } else {
            console.error('Invalid object data:', newObject);
        }
    };

    /**
     * Adds a table of type CIRCLE_TABLE to the Editor
     * @param {number} diameter : diameter of the table
     * @param {string} color : color of the table
     * @param {object} position : position of the table in the form { x: number, y: number }
     */
    const addCircleTable = (diameter, color, position) => {
      let table = {
        id: Date.now(),
        name: '',
        type: ObjectTypes.CIRCLE_TABLE,
        diameter: `${diameter}px`,
        color: `${color}`,
        position: position,
      };

      addTable(table);
    };

    /**
     * Adds a table of type RECTANGLE_TABLE to the Editor
     * @param {number} width : width of the table
     * @param {number} height : height of the table
     * @param {string} color : color of the table
     * @param {object} position : position of the table in the form { x: number, y: number }
     */
    const addRectangleTable = (width, height, color, position) => {
      let table = {
        id: Date.now(),
        name: '',
        type: ObjectTypes.RECTANGLE_TABLE,
        width: `${width}px`,
        height: `${height}px`,
        color: `${color}`,
        position: position,
      };
      addTable(table);
    };

    /** Removes an object from the collection  useCallback to prevent updating objects on function change*/
    const removeObject = useCallback((objectId) => {
        if (typeof objectId === 'undefined' || objectId === null) {
            console.error('Invalid object ID:', objectId);
            return;
        }

        // If defined then remove object
        setObjectData((prevObjectData) => {
            // Get object

            // Check if Table
            // Remove object

            const updatedObjectData = prevObjectData.filter((obj) => {
                const doNotRemoveObj = obj.id !== objectId;
                if (!doNotRemoveObj && (obj.type === ObjectTypes.CIRCLE_TABLE || obj.type === ObjectTypes.RECTANGLE_TABLE)) {
                    //counter.deleteTableID(obj.name);
                }
                return doNotRemoveObj;
            });
            if (updatedObjectData.length === prevObjectData.length) {
                console.warn('Object not found for removal:', objectId);
            }
            
            return updatedObjectData;
        });
    }, []);

    /**Prepares new object to be added to the Collection (typically used to add an object from the editor panel to the DropZone)
     * @param {object} object : Object data
     * @param {number} delta : Offset from the Editor Panel (or other component) to the DropZone
     * @param {import('react-native-safe-area-context').Rect} dropZoneRect : Dimensions of the DropZone
     */
    const prepareNewObject = (object, delta, dropZoneRect) => {
        // Find position relative to the dropzone
        let position = { x: Math.floor(delta.x - dropZoneRect.left), y: Math.floor(delta.y - dropZoneRect.top) }; // floor the positions to make positions easier to manage
        switch (object.id) {
            case EditorComponentTypes.CIRCLE_TABLE:
                // If object data is incomplete then print out a warning, an error could lead to stoppig the program
                if (!(object.diameter && object.color)) {
                    console.warn(`ObjectCollection:prepareNewObject - Circle Table data missing required paramaters: `, object);
                }
                addCircleTable(object.diameter, object.color, position);
                break;
            case EditorComponentTypes.RECTANGLE_TABLE:
                if (!(object.width && object.height && object.color)) {
                    console.error(`ObjectCollection:prepareNewObject - Rectangle Table data missing required paramaters: `, object);
                }
                addRectangleTable(object.width, object.height, object.color, position);
                break;
            default:
                console.error(`Error: Undefined object type`, object);
                break;
        }
    };// end prepareNewObject()

    /**Updates the position of the dropped object or adds a new Object to the collection
     * @param {object} object : Object data
     * @param {number} delta : Offset from original position to the new position
     * @param {import('react-native-safe-area-context').Rect} dropZoneRect : Dimensions of the DropZone
     */
    const updateDroppedObject = (object, delta, dropZoneRect) => {
        if (Object.values(ObjectTypes).includes(object.type)) {
            updateObjectPosition(object, delta);
        }
        // If the object is not included in ObjectTypes, then create a new object
        else
            prepareNewObject(object, delta, dropZoneRect);
    };// end updateDroppedObject()
    
    // Updates the position of a specified object
    const updateObjectPosition = (object, delta) => {
        // Check if object is in collection then update the position if it is
        setObjectData((prevObjectData) =>
            prevObjectData.map((obj) => {
                if (obj.id === object.id) {
                    const [x, y] = snapToGrid({x: Math.round(obj.position.x + delta.x), y: Math.round(obj.position.y + delta.y)});
                    console.log("Position plus 10: ", {x, y});
                    return {...obj, position: {x, y}};
                }
                return obj;
            }  
        ));
    };// end updateObjectPosition()

    /**Updates an object in ObjectCollection, updatedObject and the old object must have the same id */
    const updateObjectData = (updatedObject) => {
        setObjectData((prevObjectData) =>
          prevObjectData.map((obj) => (obj.id === updatedObject.id ? updatedObject : obj))
        );
    };

    return children({
        objectData, 
        addObject, removeObject, updateDroppedObject,
        saveObjectData, resetObjectData, clearAllObjectData,
        updateObjectData
    });
};// end ObjectCollection()

export default ObjectCollection;