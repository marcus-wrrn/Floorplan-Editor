//import { useEffect, useState } from "react";
import { EditorComponentTypes, EditorTable } from "../EditorPanel/EditorPanel";
import { ObjectTypes } from "../TableComponents";
import { useDragLayer } from "react-dnd";
import { headerContext } from "../../../App";
import { useContext } from "react";
import TableComponentPreview from "./TableComponentPreview";
import { PaddingOffset } from "../../TableDragging";

const layerStyles = {
  position: 'absolute',
  pointerEvents: 'none',    // Avoids undefined behavior when dragging
  left: 0,
  top: 0,
}

/**
 * Snaps coordinates to a grid (Makes all values divisible by a set integer)
 * @param {number} x -: X coordinate
 * @param {number} y -: Y coordinate 
 * @param {number} gridSize -: Size of the grid (default value: 20)
 * @returns [x, y] -: Coordinates snapped to a set grid sizes
 */
export const snapToGrid = ({x, y}, gridSize = 20) => {
  return [
    Math.round(x / gridSize ) * gridSize,
    Math.round(y / gridSize ) * gridSize,
  ];
};

const getObjectStyles = ({ currentOffset, initialOffset, clientOffset, headerDim, paddingDim }) => {
  if ( !clientOffset || !currentOffset || !initialOffset) {
    return {
      display: 'none',
    };
  }
  let {x, y} = currentOffset;
  y -= headerDim.height + paddingDim;
  [x,y] = snapToGrid({x, y});
  
  const offsetX = x; //- paddingDim.border;
  const offsetY = y; //-headerDim.height - paddingDim.border;
  const transform = `translate(${offsetX}px, ${offsetY}px)`;

  return {
    transform: transform,
    WebkitTransform: transform,
  };
};

/**
 * Manages the rendering of dragged objects. Makes a copy of the item being dragged and displays a false copy
 */
const ObjectDragLayer = () => {
  const headerDim = useContext(headerContext);
  const paddingDim = useContext(PaddingOffset);

  const { itemType, item, isDragging, clientOffset, currentOffset, initialOffset} =
  useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  

  const renderItem = () => {
    switch (itemType) {
      case ObjectTypes.CIRCLE_TABLE:
      case ObjectTypes.RECTANGLE_TABLE:
        return <TableComponentPreview tableData={item.tableData}/>
      case EditorComponentTypes.CIRCLE_TABLE:
        return <EditorTable 
          id={item.id}
          width={item.diameter}
          height={item.diameter}
          />
      case EditorComponentTypes.RECTANGLE_TABLE:
        return <EditorTable 
          id={item.id} 
          width={item.width} 
          height={item.height} 
          />
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }

  return (
  <div style={layerStyles}>
    <div style={getObjectStyles({currentOffset, initialOffset, clientOffset, headerDim, paddingDim})}>
      {/* <div style={{transform: `translate(-10px, -108.5px)`}}>
        {renderItem()}
      </div> */}
      {renderItem()}
      
    </div>
  </div>
    
  );
};

export default ObjectDragLayer;