import React from 'react';
import TableDisplay from './TableDisplay';
import '../Table.css';
import ButtonCollection from './ButtonCollection';


/**
 * TopPanel component that provides functionalities to edit tables.
 * @component
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.tableEditor - Contains various functions for managing tables.
 * @param {Object} props.selectedTable - The currently selected table object.
 * 
 * @example
 * 
 * <TopPanel tableEditor={tableEditorFunctions} selectedTable={selectedTable} />
 * 
*/
const TopPanel = ({tableEditor, selectedTable}) => {
  // Deconstruct prop for better management
  const { resetObjectData, clearAllObjectData, updateTable, 
    uploadCurrentFloorPlan, changeLayout, changeFlooring, 
    photoUrls, photoNames } = tableEditor;
  
  // Create styles to determine how component is rendered
  const topPanelStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "end",
    height: "6vh",
    width: "100%",
    position: "relative",
    backgroundColor: "rgb(245, 245, 245)",
    // color: "white",
    gap: "0px",
  };
  
  /**
   * Makes sure table is not null and contains a relevant table id
   * Return true if checks pass, false if not
   */
  const tableErrorCheck = (table) => {
    if (!table) {
      console.error("Table should not equal null");
      return false;
    }
    if (!table.id) {
      console.error("Table should include an id");
      return false;
    }
    return true;
  };

  const changeName = (table, newName) => {
    if (!tableErrorCheck(table)) {
      return;
    }
    if (!table.name) {
      console.warn("Table does not have a name", table);
    }
    table.name = newName;
    updateTable(table);
  };


  const changePosition = (table, position) => {
    if (!tableErrorCheck(table)) {
      return;
    }

    // Make sure all key values are numbers
    for (let key in position) {
      if (isNaN(position[key])) {
        console.warn(`Warning all position values should be a number: key: ${key}:${position[key]}`);
        position[key] = parseInt(position[key]);
      }
    }

    table.position.x = position.x ? Number(position.x) : 0;
    table.position.y = position.y ? Number(position.y) : 0;
    updateTable(table);
  };

  /**Changes table color */
  const changeColor = (table, color) => {
    if (!tableErrorCheck(table)) {
      return;
    }
    if (!table.color) {
      console.error("Table does not contain a color", table);
    }
    table.color = color;
    updateTable(table);
  };

  /**Changes the diameter of the table */
  const changeCircleTableDiameter = (table, diameter) => {
    if (!tableErrorCheck(table)) {
      return;
    }
    if (!table.diameter) {
      console.error("Table does not contain a diameter", table);
      return;
    }
    table.diameter = diameter;
    updateTable(table);
  };

  const changeRectangleTableHeightWidth = (table, height, width) => {
    if (!tableErrorCheck(table)) {
      return;
    }
    if (!table.height || table.width) {
      console.error("Table does not contain a width and/or a height", table);
      return;
    }
    table.height = height;
    table.width = width;
    updateTable(table);
  };

  const changeFlooringFunc = (index) => {
    changeFlooring(index);
  };

  return (
    <div>
      <div style={topPanelStyle}>
        <ButtonCollection 
          uploadCurrentFloorPlan={uploadCurrentFloorPlan}
          resetObjectData={resetObjectData}
          clearAllObjectData={clearAllObjectData}
          changeLayout={changeLayout}
          changeFlooring={changeFlooringFunc}
        />
        <div>
          <TableDisplay 
            table={selectedTable} 
            changeName={changeName} 
            changePosition={changePosition} 
            changeColor={changeColor} 
            changeCircleTableDiameter={changeCircleTableDiameter}
            changeRectangleTableHeightWidth={changeRectangleTableHeightWidth}
          />
        </div>
        {/*This is just a placeholder for functionality that may be added later*/}
        <div style={{backgroundColor: "blue"}}>
          {/* <div style={{width: "20vw", height: "50px"}}>
            <p>Hello World!</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};// end TopPanel

export default TopPanel;