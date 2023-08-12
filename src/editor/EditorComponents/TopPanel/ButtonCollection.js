import React, {useState} from "react";

/**
 * Dropdown component for selecting an item from a collection.
 * @component
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Array.<string|number>} props.items - An array of items to be displayed in the dropdown menu.
 * @param {string} props.text - The text to be displayed on the dropdown button.
 * @param {Function} props.onClick - A function to be executed when an item is clicked. The clicked item is passed as a parameter.
 * 
 * @example
 * 
 * <Dropdown items={['Apple', 'Banana', 'Cherry']} text='Select Fruit' onClick={item => console.log(`You selected ${item}`)} />
 * 
 */
const Dropdown = ({ items, text, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  /**Toggles the visibility of the dropdown menu.*/
  const toggleOpen = () => setIsOpen(!isOpen);

  /**
   * Handles the click event of an item in the dropdown menu.
   * It triggers the passed onClick function with the clicked item as the parameter, and then closes the dropdown menu.
   * @param {string|number} item - The clicked item.
   */
  const onItemClick = (item) => {
    onClick(item);
    setIsOpen(false);
  };

  const dropDownStyle = {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    margin: '0px',
    zIndex: 1000,
  };

  return (
    <div className="dropdown" style={{position: 'relative', margin: '0px'}}>
      <button onClick={toggleOpen}>{text}</button>
      {isOpen && (
        <ul className="dropdown-menu" style={dropDownStyle}>
          {items.map((item, index) => (
            <li key={index} onClick={() => onItemClick(item)}>
              {item + 1}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};// end Dropdown()

// Styles for the panel
const editStyles = {
  backgroundColor: "black",
  padding: "10px",
};

/**Standard button component for the use of easy adding tables */
const StandardButton = ({text, onClick}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
};

/**
 * ButtonCollection component displays a collection of action buttons and dropdown menus for layout and floor plan selection.
 * @component
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.uploadCurrentFloorPlan - A function that is executed when "Upload Floor Plan" button is clicked.
 * @param {Function} props.resetObjectData - A function that is executed when "Reset Table Data" button is clicked.
 * @param {Function} props.clearAllObjectData - A function that is executed when "Clear All" button is clicked.
 * @param {Function} props.changeLayout - A function that is executed when an item is selected in the "Change Table Layout" dropdown. The selected index is passed as a parameter.
 * @param {Function} props.changeFlooring - A function that is executed when an item is selected in the "Change Floor Plan" dropdown. The selected index is passed as a parameter.
 * 
 */
const ButtonCollection = ({ uploadCurrentFloorPlan, resetObjectData, clearAllObjectData, changeLayout, changeFlooring }) => {

  return (
    <div style={{...editStyles,  position: 'absolute', left: '0', backgroundColor: 'transparent', display: 'flex', bottom: "10px"}}>
      {/*TODO: fix items so that it's dynamic and not hard coded in */}
      <Dropdown items={[0, 1, 2]} text={"Change Table Layout"} onClick={changeLayout}/>
      <Dropdown items={[0, 1, 2]} text={"Change Floor Plan"} onClick={changeFlooring}/>
      <StandardButton text={"Upload Layout"} onClick={uploadCurrentFloorPlan} />
      <StandardButton text={"Reset Table Data"} onClick={() => resetObjectData(true)} />
      <StandardButton text={"Clear All"} onClick={clearAllObjectData} />
    </div>
  );
};// end ButtonCollection

export default ButtonCollection;