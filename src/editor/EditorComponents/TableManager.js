import { useState, useRef, useEffect } from "react";
import TopPanel from "./TopPanel/TopPanel";
import DropZone from "./DropZone";
import { EditorPanel } from "./EditorPanel/EditorPanel";
import { ObjectTypes } from "./TableComponents";
import TableContextMenu from "./ContextMenu/TableContextMenu";
//import FileManager from "./FileManager/FileManager";

/**
 * Manages Table Editing + rendering components, can only edit one table at a time
 */
const TableManager = ({ objCollection, layCollection }) => {
  // Deconstruct object collection for ease of use
  const { objectData,  updateObjectData, removeObject, updateDroppedObject, 
    saveObjectData, resetObjectData, clearAllObjectData } = objCollection;

  const {changeLayout, uploadFloorPlan, changeFlooring, floorplan, photoUrls, photoNames } = layCollection;

  // Set the table that the editor is currently editing
  const [selectedTable, setTable] = useState(null);
  const [selectedTableID, setTableID] = useState(null);
  const editorRef = useRef(null);   // Reference for the editor panel
  

  // Set visibility and position of context menu
  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 } });
  const contextMenuRef = useRef();

  // Makes sure that selectedTableID is consistent with the selectedTable
  useEffect(() => {
    if (selectedTable) {
      setTableID(selectedTable.id);
    }
    else {
      setTableID(null);
    }
  }, [selectedTable]);

  /**Updates the selected Table whenever there is a change */
  useEffect(() => {
    for (let i in objectData) {
      let obj = objectData[i];
      if (obj.id === selectedTableID) {
        setTable(obj);
      }
    }
  }, [objectData, selectedTableID]);

  // Handle all key and mouse events
  useEffect(() => {

    const moveTable = ({tableData, x, y}) => {
      tableData.position.x += x;
      tableData.position.y += y;
      console.log(`Updating object position by: ${x}, ${y}`);
      updateObjectData(tableData);
    };

    const handleClickOutside = (e) => {
      // If the context menu is visible and user clicks outside of the context menu then close the menu
      if (contextMenu.visible && (!contextMenuRef.current || !contextMenuRef.current.contains(e.target))) {
        setContextMenu({ visible: false, position: { x: 0, y: 0 } });
      }
    };

    // handles key press events
    const handleKeyPress = (e) => {
      if (selectedTable) {
        switch (e.key) {
          case 'Delete':
            removeObject(selectedTable.id);
            setTable(null);
            setContextMenu({...contextMenu, visible: false});
            break;
          case 'ArrowUp':
            moveTable({tableData: selectedTable, x: 0, y: -5});
            break;
          case 'ArrowRight':
            moveTable({tableData: selectedTable, x: 5, y: 0});
            break;
          case 'ArrowDown':
            moveTable({tableData: selectedTable, x: 0, y: 5});
            break;
          case 'ArrowLeft':
            moveTable({tableData: selectedTable, x: -5, y: 0});
            break;
          default:
            break;
        }
      }
    };

    // Add event listeners for key presses and clicks
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [contextMenu, selectedTable, removeObject, updateObjectData]);


  // When a table is clicked select the table
  const handleTableClick = (tableData) => {
    setTable(tableData);
  };

  const editTable = (e, data) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    setTable(data);
    if (Object.values(ObjectTypes).includes(data.type)) {
      setContextMenu({ visible: true, position: { x: e.pageX, y: e.pageY } });
    } 
  };

  const deleteTable = (tableID) => {
    removeObject(tableID);
    setTable(null);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const updateTable = (table) => {
    updateObjectData(table);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const changeName = (table, newName="Example Name") => {
    table.name = newName;
    updateObjectData(table);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDropZoneClicked = (e) => {
    if (e.target === e.currentTarget) {
      setTable(null);
    }
  };

  const uploadCurrentFloorPlan = () => {
    uploadFloorPlan(objectData);
  };

  const rotateTable = (table) => {
    if (table.type === ObjectTypes.RECTANGLE_TABLE) {
      let tempVal = table.height;
      table.height = table.width;
      table.width = tempVal;
      updateObjectData(table);
      setContextMenu({ visible: false });
    }
    setContextMenu({ visible: false });
  };

  return (
    <div className="table-edit-page">
      {/* <FileManager /> */}
      <TopPanel 
        tableEditor={{
          saveObjectData, resetObjectData, clearAllObjectData, 
          uploadCurrentFloorPlan, updateTable, changeLayout,
          changeFlooring, photoUrls, photoNames,
        }}
        
        objectData={objectData}
        selectedTable={selectedTable}
      />
      <div className="table-editor">
          <DropZone
            objectData={objectData}
            updateObjectPosition={updateDroppedObject}
            selectTable={editTable}
            removeObject={removeObject}
            editorRef={editorRef}
            floorlayout={floorplan}
            handleTableClick={handleTableClick}
            selectedTableId={selectedTableID}
            onClick={handleDropZoneClicked}
          />
          <EditorPanel
            ref={editorRef}
          />
          {contextMenu.visible && (
          <TableContextMenu
            contextMenuRef={contextMenuRef}
            tableData={selectedTable}
            position={contextMenu.position}
            onDelete={deleteTable}
            onChangeName={changeName}
            rotateTable={rotateTable}
          />
          )}
      </div>
    </div>
  );
};// end TableManager()

export default TableManager;
