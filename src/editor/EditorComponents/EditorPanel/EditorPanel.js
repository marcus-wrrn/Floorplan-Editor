import { forwardRef, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import styles from './EditorPanel.module.css'
import '../Table.css';
import { getEmptyImage } from 'react-dnd-html5-backend';

export const EditorComponentTypes = {
  CIRCLE_TABLE: 'editor_circle_table',
  RECTANGLE_TABLE: 'editor_rectangle_table',
};

/**
 * Constructs and returns a table object for dragging the editor table into the DropZone.
 * @param {Object} objectData - The original object data.
 * @param {Object} clientOffset - The client's x and y offset.
 * @param {Object} tableRect - The table's client rectangle.
 * @return {Object} The new table object containing original data plus offsets.
*/
const buildTableObject = (objectData, clientOffset, tableRect) => {
  let data = {...objectData, offsetX: clientOffset.x - tableRect.left, offsetY: clientOffset.y - tableRect.top}
  return (data);
};// end buildTableObject()

/**
 * Renders An Editor table, rendering is determined by table id.
 * @param {Object} props - The properties of the EditorTable component.
 * @param {string} props.id - The id of the EditorTable.
 * @param {number} props.width - The width of the EditorTable.
 * @param {number} props.height - The height of the EditorTable.
 * @param {string} props.color - The color of the EditorTable.
 * @return {JSX.Element} The rendered EditorTable component.
*/
export const EditorTable = ({ id, width, height }) => {
  const isCircle = id === EditorComponentTypes.CIRCLE_TABLE;

  const backgroundColor = 'transparent';
  const border = '5.2px solid black';


  // Dimensions solely for rendering purposes
  const dimensions = {
    width: `${width}px`,
    height: `${height}px`,
    minWidth: `${width}px`,
    minHeight: `${height}px`,
  };

  return (
      <div
      className={`editorscreen-editor-${isCircle ? 'circle' : 'rectangle'}-table`}
      style={{
        backgroundColor: backgroundColor,
        border: border,
        ...dimensions,
        display: 'flex',
      }}
      >
        <div className={`table-inner-${isCircle ? 'circle' : 'rectangle'}`}>
            <p></p>
        </div>
      </div>
  );
}; // end EditorTable


/**Defines the drag logic for the editor tables, 
 * @param {EditorComponentTypes} type -: Determines the type of Table to be rendered
 * @param {object} tableData -: Contains all necessary object data to render table
*/
const DraggableEditorTable = ({ tableData }) => {
  const isCircle = tableData.id === EditorComponentTypes.CIRCLE_TABLE;
  const tableRef = useRef();

  const [, drag, preview] = useDrag(() => ({
    type: tableData.id,
    item: (monitor) => {
      // If dropped, determine if it is a circle, if so pass in the diameter instead of height and width
      const obj = isCircle ? 
        {id: tableData.id, diameter: tableData.diameter, color: tableData.color} : 
        {id: tableData.id, height: tableData.height, width: tableData.width, color: tableData.color};
      return buildTableObject(obj, monitor.getClientOffset(), tableRef.current.getBoundingClientRect());
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    drag(tableRef);
    // preview(tableRef);
  }, [drag]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);


  return (
    <div ref={tableRef} style={{}}>
      {tableData.id === EditorComponentTypes.CIRCLE_TABLE ? (
        <EditorTable 
          id={tableData.id}
          width={tableData.diameter}
          height={tableData.diameter}
        />
      ) : (
        <EditorTable 
          id={tableData.id}
          width={tableData.width}
          height={tableData.height}
        />
      )}
    </div>
  );
};

/**
 * Display's The table to be added alongside it's text
 * @param {Object} tableData -: Editor table data, different than regular tableData, must have an id tag of type EditorComponentTypes
 * @param {string} text -: Text which displays the name of the table being added
 */
const EditorTableDisplay = ({tableData, text}) => {
  return (
    <div className={styles.tableDisplay}>
      <DraggableEditorTable tableData={tableData} />
      <p>{text}</p>
    </div>
  );
};// end EditorTableDisplay()

/**
 * Side panel in the Table Editor, used to add new tables to the floorplan
 */
export const EditorPanel = forwardRef(({_}, ref) => {
  const defaultDiameter = 200;
  const defaultColor = "#00000000";

  // Factories for easier table building
  const circleTableFactory = (diameter=defaultDiameter, color=defaultColor) => {
    return {
      id: EditorComponentTypes.CIRCLE_TABLE,
      diameter: diameter,
      color: color
    };
  };

  const rectangleTableFactory = (height=defaultDiameter/3.5, width=defaultDiameter/1.5, color=defaultColor) => {
    return {
      id: EditorComponentTypes.RECTANGLE_TABLE,
      height: height,
      width: width,
      color: color,
    };
  };
  // "editorscreen-editor-panel"
  return (
      <div ref={ref} className={styles.container}>
        <div className={styles.tableContainer}>
          <span className={styles.headerText}>Tables</span>
          <div className={styles.tablePanel}>
            <EditorTableDisplay tableData={circleTableFactory(defaultDiameter/1.5)} 
            text={"Circle Table"}
            />
            <EditorTableDisplay tableData={circleTableFactory(defaultDiameter/4, defaultColor)}
            text={"Smaller Table"}
            />
            <EditorTableDisplay tableData={rectangleTableFactory()}
            text={"Rectangle Table"}
            />
            <EditorTableDisplay tableData={rectangleTableFactory(25, 100)}
            text={"Example Table"}/>
          </div>
        </div>
      </div>
  );
});
  