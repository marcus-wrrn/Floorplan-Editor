import { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableTable, ObjectTypes } from './TableComponents';
import { EditorComponentTypes } from './EditorPanel/EditorPanel';
import FloorLayout from './LayoutComponents';
import Renaissance from "./Renaissance.svg"
import './Table.css';

// DropZone represents the area where tables can be dragged and dropped
const DropZone = ({ objectData, updateObjectPosition, editorRef, selectTable, floorlayout, handleTableClick, selectedTableId, onClick }) => {
  const dropRef = useRef(null);


  // Drops an object from the editor panel into the dropzone
  const getObjectDelta = (item, monitor) => {
    if (Object.values(EditorComponentTypes).includes(item.id)) {
      // Get position of mouse cursor
      const pointerPosition = monitor.getClientOffset();
      // Get the dimensions of both the dropzone and the editor panel (div dimensions based on their references)
      const dropZoneRect = dropRef.current.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      // Calculate offset
      const offsetX = dropZoneRect.left - editorRect.right - item.offsetX;
      const offsetY = dropZoneRect.top - editorRect.top - item.offsetY;
      // Find change in position relative to dropzone
      return ({ x: pointerPosition.x + offsetX, y: pointerPosition.y + offsetY, });
    }
    return monitor.getDifferenceFromInitialOffset();
  };// end dropEditorObject()

  // Drop an object to the dropzone
  const dropObject = (item, monitor) => {
    const delta = getObjectDelta(item, monitor);
    const dropZoneRect = dropRef.current.getBoundingClientRect();

    updateObjectPosition(item, delta, dropZoneRect);
  };

  const [, drop] = useDrop(() => ({
    accept: [ObjectTypes.CIRCLE_TABLE, ObjectTypes.RECTANGLE_TABLE, EditorComponentTypes.CIRCLE_TABLE, EditorComponentTypes.RECTANGLE_TABLE],
    drop: (item, monitor) => {
      console.log("Dropped Item: ", item);
      console.log("Initial Offset: ", monitor.getInitialClientOffset());
      dropObject(item, monitor);
    },
  }), [selectedTableId]);   // selectedTable is used as a dependency to make sure that the latest version of the ID is used (otherwise it will almost always be null)

  useEffect(() => {
    drop(dropRef);
  }, [drop]);

  return (
    <div style={{boxShadow: 'inset 0 0 10px rgb(40, 40, 40)'}}ref={dropRef} className="editorscreen-full-screen-container" onClick={onClick}>
      <FloorLayout 
        floorLayout={Renaissance}
        scaleBy={1.6}
        rotateBy={90}
        position={{x: -50, y: -500}}
        onClick={onClick}
      />
      <div className="editorscreen-table-container">
        {objectData && objectData.map((obj) => (
          <DraggableTable 
            key={obj.id} 
            tableData={{...obj, selected: obj.id === selectedTableId}} 
            onRightClick={selectTable} 
            onLeftClick={() => handleTableClick(obj)} 
            isSelected={obj.id === selectedTableId}
          />
          
        ))}
      </div>
    
    </div>
  );
};// end DropZone()

export default DropZone;