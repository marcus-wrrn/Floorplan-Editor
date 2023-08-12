import React, { useEffect, useState } from 'react';
import { ObjectTypes } from '../TableComponents';

/**Displays all editor features specific to the tables in the TopPanel of the FloorPlanEditor */
const TableDisplay = ({table, changeName, changePosition, changeColor, changeCircleTableDiameter, changeRectangleTableHeightWidth}) => {

  // Basic style used to organize divs row wise
  const displayStyle = {
    display: "flex",
    alignItems: "center",
  };

  // Used to render the body of the component
  const tableDisplayBodyStyle = {
    position: "absolute",         // I'd love to make this more reactive but I keep running into problems with the rendering
    right: "20px",
    display: "flex",
    alignItems: "center",
    columnGap: "15px",
    bottom:  "5px",
    backgroundColor: "transparent",
  };

  /**Renders the coordinates of the selected table */
  const PositionInput = ({changePosition}) => {
    const [positionX, setPositionX] = useState(null);
    const [positionY, setPositionY] = useState(null);

    useEffect(() => {
      if (table !== null) {
        setPositionX(table.position.x ? table.position.x : '');
        setPositionY(table.position.y ? table.position.y : '');
      }
    }, []);

    const KeyType = {
      X: 0,
      Y: 1,
    };

    const handleBackSpace = (newVal, keyType) => {
      switch (keyType) {
        case KeyType.X:
          setPositionX(newVal === 0 ? '' : newVal);
          break;
        case KeyType.Y:
          setPositionY(newVal === 0 ? '' : newVal);
          break;
        default:
          console.error("Error Key of invalid type", keyType);
          break;
      }
    };

    const updatePosition = (val, keyType) => {
      switch (keyType) {
        case KeyType.X:
          setPositionX(val === 0 ? '' : val);
          break;
        case KeyType.Y:
          setPositionY(val === 0 ? '' : val);
          break;
        default:
          console.error("Error Key of invalid type", keyType);
          break;
      }
    }; 

    const handleKeyPress = (event, keyType) => {
      if (!table) {
        return;
      }
      let currentVal = parseInt(event.target.value);
      let key = event.key;
      if (!isNaN(key)) {
        currentVal = isNaN(currentVal) ? key : currentVal + key;
        updatePosition(currentVal, keyType);
      }
      else if (key === "Backspace") {
        console.log("Backspace pressed");
        currentVal /= 10;
        handleBackSpace(parseInt(currentVal), keyType);
      }
      else if (key === "Enter") {
        let position = { x: positionX ? positionX : 0, y: positionY ? positionY : 0 };
        changePosition(table, position);
      }
    };// end handleSubmit()
    
    return (
      <div style={displayStyle}>
        <div style={{...displayStyle, paddingRight: "10px"}}>
          <p>X:</p>
          <input type="text" value={positionX ? positionX : ''} onChange={() => {}} onKeyDown={(event) => handleKeyPress(event, KeyType.X)} style={{width: '50px'}}/>
        </div>
        <div style={displayStyle}>
          <p>Y:</p>
          <input type="text" value={positionY ? positionY : ''} onChange={() => {}} onKeyDown={(event) => handleKeyPress(event, KeyType.Y)} style={{width: '50px'}}/>
        </div>
      </div>
    );
  };// end PositionInput()

  /**Allows user to enter new table name */
  const NameSelection = ({changeName}) => {
    const [name, setName] = useState("");

    useEffect(() => {
      if (table) {
        setName(table.name ? table.name : "");
      }
    }, []);

    const handleChange = (event) => {
      if (!table) {
        return;
      }
      const newName = event.target.value;
      setName(newName);
    };

    const handleSubmit = (event) => {
      if (!table) {
        return;
      }
      if (event.key === "Enter") {
        changeName(table, name);
      }
    };

    return (
      <div style={displayStyle}>
        <p>Table Name:</p>
        <input type="text" value={name} onChange={handleChange} onKeyDown={handleSubmit} style={{width: '100px', height: '10px'}}/>
      </div>
    );
  };// end NameSelection

  /**Allows user to change the color of the selected table */
  const ColorPicker = ({table, changeColor}) => {
    const [color, setColor] = useState({r: null, g: null, b: null});

    // Enum used to determine which color is being modified
    const ColorVals = {
      Red: 'red',
      Green: 'green',
      Blue: 'blue',
    };

    /**Converts hexadecimal values to their rgb representations */
    const hexToObj = (hex) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
          r = "0x" + hex[1] + hex[1];
          g = "0x" + hex[2] + hex[2];
          b = "0x" + hex[3] + hex[3];
      } else if (hex.length === 7) {
          r = "0x" + hex[1] + hex[2];
          g = "0x" + hex[3] + hex[4];
          b = "0x" + hex[5] + hex[6];
      }
      return {
          r: +r,
          g: +g,
          b: +b
      };
    };
    
    const rgbToObj = (rgb) => {
      const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (!matches) {
        console.error('Invalid RGB format');
      }
      return {
          r: Number(matches[1]),
          g: Number(matches[2]),
          b: Number(matches[3])
      };
    };

    // Finds the rgb color representation of the table and stores it in the color variable
    useEffect(() => {
      /**Parses color from hexadecimal and rgb strings to rgb object */
      const parseColor = (input) => {
        try {
          if (input.startsWith('#')) {
            return hexToObj(input);
          } else if (input.startsWith('rgb')) {
            return rgbToObj(input);
          } else {
            console.error('Invalid color format');
            return {r: 0, g: 0, b: 0};
          }
        } catch (error) {
          console.error("Object color not stored properly: ", error);
          return {r: 0, g: 0, b: 0};
        }
      }

      if (table !== null) {
        // Make sure that the color values are in their proper representation
        const colorVal = parseColor(table.color);
        setColor(colorVal);
      }
    }, [table]);

    /**Handles the behavior of the backspace key (prevents null errors) */
    const handleBackSpace = (newVal, colorType) => {
      switch (colorType) {
        case ColorVals.Red:
          setColor({...color, r: newVal === 0 ? '' : newVal});
          break;
        case ColorVals.Green:
          setColor({...color, g: newVal === 0 ? '' : newVal});
          break;
        case ColorVals.Blue:
          setColor({...color, b: newVal === 0 ? '' : newVal});
          break;
        default:
          console.warn("TopPanel:TableEditor Warning: color value not part of ColorVals class: ", colorType);
          break;
      }
    };// end handleBackSpace()

    /**Changes the value of the table color*/
    const modifyColorVal = (value, colorType) => {
      switch (colorType) {
        case ColorVals.Red:
          setColor({...color, r: value});
          break;
        case ColorVals.Green:
          setColor({...color, g: value});
          break;
        case ColorVals.Blue:
          setColor({...color, b: value});
          break;
        default:
          console.warn("TopPanel:TableEditor Warning: color value not part of ColorVals class: ", colorType);
          break;
      }
    };// end modifyColorVal()

    const parseColorObjToString = (colorVal) => {
      try {
        let red = colorVal.r ? colorVal.r : 0;
        let green = colorVal.g ? colorVal.g : 0;
        let blue = colorVal.b ? colorVal.b : 0;
        return "rgb(" + red + ", " + green + ", " + blue + ")";
      } catch (error) {
        console.error("Parsing Color Obj Error: ", error);
        console.log(`ColorVal: `, colorVal);
        return "rgb(0, 0, 0)";
      }
    };

    const handleColorPress = (event, colorType) => {
      // If table is null do not log key presses
      if (!table) {
        return;
      }
      // Get the current color value
      let currentVal = parseInt(event.target.value);
      let key = event.key;
      if (!isNaN(key)) {
        currentVal = isNaN(currentVal) ? key : currentVal + key;
        modifyColorVal(currentVal, colorType);
      }
      else if (key === "Backspace") {
        currentVal /= 10;
        handleBackSpace(parseInt(currentVal), colorType);
      }
      if (event.key === "Enter") {;
        changeColor(table, parseColorObjToString(color));
      }
    };// end handleColorPress()

    const inputStyle = {
      width: "30px",
    };

    return (
      <div style={displayStyle}>
        <p>Change Color: </p>
        <div style={displayStyle}>
          <p style={{paddingLeft: "5px"}}>r:</p>
          {/* All inputs use onKeyDown to handle modifications, this makes it easier to parse for incorrect inputs */}
          <input type="text" value={color.r ? color.r : ""} onChange={() => {}} onKeyDown={(event) => handleColorPress(event, ColorVals.Red)} style={inputStyle}/>
          <p style={{paddingLeft: "5px"}}>g:</p>
          <input type="text" value={color.g ? color.g : ""} onChange={() => {}} onKeyDown={(event) => handleColorPress(event, ColorVals.Green)} style={inputStyle}/>
          <p style={{paddingLeft: "5px"}}>b:</p>
          <input type="text" value={color.b ? color.b : ""} onChange={() => {}} onKeyDown={(event) => handleColorPress(event, ColorVals.Blue)} style={inputStyle}/>
        </div>
      </div>
    );
  };// end ColorPicker

  const DimensionTypes = {
    diameter: 'diameter',
    height: 'height',
    width: 'width',
  };
  
  const TableSizeEditor = ({ changeDimensions }) => {
    const [objectType, setObjectType] = useState(null);
    const [dimensions, setDimensions] = useState({ diameter: '', height: '', width: '' });
    const [inputValues, setInputValues] = useState({ diameter: '', height: '', width: '' });
  
    useEffect(() => {
      if (table && table.type) {
        setObjectType(table.type);
        let newDimensions = { diameter: '', height: '', width: '' };
        switch (table.type) {
          case ObjectTypes.CIRCLE_TABLE:
            newDimensions.diameter = parseInt(table.diameter);
            break;
          case ObjectTypes.RECTANGLE_TABLE:
            newDimensions.height = parseInt(table.height);
            newDimensions.width = parseInt(table.width);
            break;
          default:
            console.error("Warning object does not have a valid type", table);
            break;
        }
        setDimensions(newDimensions);
        setInputValues(newDimensions);
      }

      if (table !== null) {
        setDimensions(table.diameter)
      }
    }, []);
  
    const handleChange = (event, dimensionType) => {
      setInputValues({ ...inputValues, [dimensionType]: event.target.value });
    };
  
    const handleKeyPress = (event, dimensionType) => {
      if (event.key === "Enter") {
        if (!isNaN(parseInt(inputValues[dimensionType]))) {
          setDimensions({ ...dimensions, [dimensionType]: parseInt(inputValues[dimensionType]) });
          changeDimensions(dimensions);
        } else {
          setInputValues({ ...inputValues, [dimensionType]: dimensions[dimensionType] });
        }
      }
    };
  
    const renderInputField = (dimensionType) => {
      return (
        <div style={displayStyle}>
          <p>{dimensionType.charAt(0).toUpperCase() + dimensionType.slice(1)}: </p>
          <input
            type='text'
            value={parseInt(inputValues[dimensionType]) || ''}
            onChange={(event) => handleChange(event, dimensionType)}
            onKeyDown={(event) => handleKeyPress(event, dimensionType)}
          />
        </div>
      );
    }
  
    const ObjectRenderer = () => {
      switch (objectType) {
        case ObjectTypes.CIRCLE_TABLE:
          return renderInputField(DimensionTypes.diameter);
        case ObjectTypes.RECTANGLE_TABLE:
          return (
            <>
              {renderInputField(DimensionTypes.height)}
              {renderInputField(DimensionTypes.width)}
            </>
          );
        default:
          console.error("Object does not exist in Object Types class", objectType);
          break;
      }
    };
  
    return (
      <div style={displayStyle}>
        <p>Change Shape: </p>
        {objectType && <ObjectRenderer />}
      </div>
    );
  };// end TableSizeEditor

  return (
    <div style={tableDisplayBodyStyle}>
      <PositionInput table={table} changePosition={changePosition}/>
      <NameSelection table={table} changeName={changeName}/>
      <ColorPicker table={table} changeColor={changeColor}/>
      {/* <TableSizeEditor table={table} /> */}
      {/* <p>ID: {table ? table.id : ""}</p> */}
    </div>
  );
};// end TableDisplay

export default TableDisplay;