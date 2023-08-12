import React, { useEffect, useState, useRef, memo } from 'react';
import { useDrag } from 'react-dnd';
import './Table.css';
import { getEmptyImage } from 'react-dnd-html5-backend';


// Define draggable item types
export const ObjectTypes = {
  CIRCLE_TABLE: 'circle_table',
  RECTANGLE_TABLE: 'rectangle_table',
  FLOOR_PLAN: 'floorplan',
}; 

/**
 * TableComponent represents an individual draggable table which can be either circular or rectangular.
 * @component
 * @param {object} props - The properties for the component.
 * @param {string} props.tableData.id - The ID of the table.
 * @param {string} props.tableData.name - The name of the table.
 * @param {number} props.tableData.diameter - The diameter of the table for circle tables.
 * @param {number} props.tableData.width - The width of the table for rectangle tables.
 * @param {number} props.tableData.height - The height of the table for rectangle tables.
 * @param {object} props.tableData.position - The position of the table.
 * @param {string} props.tableData.color - The color of the table.
 * @param {function} props.onRightClick - The callback for handling right-click events
 * @param {function} props.onLeftClick - The callback for handling left-click events
 * @param {string} props.tableType - The type of the table. Can be 'CIRCLE_TABLE' or 'RECTANGLE_TABLE'.
 * @return {JSX.Element} The TableComponent component.
*/
const TableComponentRendering = ({ tableData, onRightClick, onLeftClick }) => {
  const [isSelected, setSelected] = useState(tableData.selected);
  const isCircle = tableData.type === ObjectTypes.CIRCLE_TABLE;

  useEffect(() => {
    setSelected(tableData.selected);
  }, [tableData, tableData.position]);

  const tableStyle = {};
  if (isCircle) {
    tableStyle.width = `${tableData.diameter}`;
    tableStyle.height = `${tableData.diameter}`;
  } else {
    tableStyle.width = `${tableData.width}`;
    tableStyle.height = `${tableData.height}`;
  }

  const rightClickHelper = (event) => {
    if (onRightClick) {
      onRightClick(event, tableData);
    }
  };

  const leftClickHelper = (event) => {
    if (onLeftClick) {
      onLeftClick(event);
    }
  };

  // Get border radius style
  let borderRad = isCircle ? `50%` : `0%`;

  return (
    <div style={tableStyle} className={`${isCircle ? `circle-table` : `rectangle-table`}`} onClick={leftClickHelper} onContextMenu={rightClickHelper}>
        <div className={isCircle ? "table-inner-circle" : "table-inner-rectangle"}>
          {isSelected ? (<div className={"table-select"} style={{width: tableStyle.width, height: tableStyle.height, borderRadius: borderRad}}>
            <p>{tableData.name}</p>
          </div>) : 
          (<p>{tableData.name}</p>)}
      </div>
    </div>
  );
};// end TableComponent()


export const DraggableTable = memo(({tableData, onRightClick, onLeftClick}) => {
  const tableRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: tableData.type,
    item: () => {
      return {
        id: tableData.id,
        type: tableData.type,
        tableData,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true});
  }, [preview])

  const getStyles =  (x, y, isDragging) => {
    const transform = `translate(${x}px, ${y}px)`;
    return {
      position: 'absolute',
      transform,
      WebkitTransform: transform,
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    }
  };

  return (
    <div ref={tableRef}>
      <div ref={drag} style={getStyles(tableData.position.x, tableData.position.y, isDragging)}>
        <TableComponent tableData={tableData} onRightClick={onRightClick} onLeftClick={onLeftClick}/>
      </div>
    </div>
  );
});


/**
 * TableComponent determines the table type to be rendered.
 * @component
 * @param {object} props - The properties for the component.
 * @param {object} props.tableData - The data for the table to be rendered.
 * @param {function} props.removeTable - The callback for removing a table.
 * @return {JSX.Element} The TableComponent component.
*/
export const TableComponent = ({ tableData, onRightClick: handleRightClick, onLeftClick: handleLeftClick}) => {
  return (
    <>
      <TableComponentRendering 
        tableData={tableData}
        onRightClick={handleRightClick}
        onLeftClick={handleLeftClick}
      />
    </>
  );
};// end TableComponent()

