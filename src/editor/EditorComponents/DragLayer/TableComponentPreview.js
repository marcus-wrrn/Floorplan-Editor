import { TableComponent } from "../TableComponents";
//import { memo, useEffect } from "react";

/**
 * TableComponent determines the table type to be rendered.
 * @component
 * @param {object} props - The properties for the component.
 * @param {object} props.tableData - The data for the table to be rendered.
 * @param {function} props.removeTable - The callback for removing a table.
 * @return {JSX.Element} The TableComponent component.
*/
const TableComponentPreview = ({ tableData, onRightClick: handleRightClick, onLeftClick: handleLeftClick}) => {

  // useEffect(() => {
  //   console.log(tableData.selected);
  // }, []);

  return (
    <div style={{position: 'inline-block'}}>
      <TableComponent
        tableData={tableData}
        onRightClick={handleRightClick}
        onLeftClick={handleLeftClick}
      />
    </div>
  );
};// end TableComponent()

export default TableComponentPreview;