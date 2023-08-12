import { useEffect, useState } from "react";
import { ObjectTypes } from "../TableComponents";


const TableSizeRenderer = ({tableToRender, changeTableDiameter, changeTableWidthHeight, displayStyle}) => {
    const [table, setTable] = useState(null);
    const [tableType, setTableType] = useState(null);

    useEffect(() => {
        if (tableToRender) {
            setTable(tableToRender);
            setTableType(tableToRender.type ? tableToRender.type : null);
        }
    }, [tableToRender]);

    const RenderTable = () => {
        switch (tableType) {
            case ObjectTypes.CIRCLE_TABLE:
                return (
                    <CircleTableSizeEditor tableDiameter={table.diameter}/>
                );
            case ObjectTypes.RECTANGLE_TABLE:
                return (<p>Null</p>);
            default:
                console.error("Not inside the ");
                return (<p>Null</p>);
        }
    };

    return (
        <>
            <RenderTable />
        </>
    );
};

const CircleTableSizeEditor = ({tableDiameter, changeSize, displayStyle}) => {
    const [diameter, setDiameter] = useState(parseInt(tableDiameter));

    const handleKeyPress = (event) => {
        let currentVal = parseInt(event.target.value);
        let key = event.key;
        if (!isNaN(key)) {
            currentVal = isNaN(currentVal) ? key : currentVal + key;
            setDiameter(currentVal);
        }
        else if (key === "Backspace") {
            currentVal /= 10;
            setDiameter(currentVal !== 0 ? currentVal : '');
        }
        else if (key === "Enter") {
            console.log("Enter key pressed");
            //changeSize(diameter);
        }
    };

    return (
        <div style={displayStyle}>
            <p>Diameter:</p>
            <input type="text" value={diameter ? diameter : ''} onChange={() => {}} onKeyDown={handleKeyPress}/>
        </div>
    );
};

export default TableSizeRenderer;