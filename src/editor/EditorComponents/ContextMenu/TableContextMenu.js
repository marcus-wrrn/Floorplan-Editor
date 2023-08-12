import styles from "./TableContextMenu.module.css"
/**
 * TableContextMenu component that renders the context menu.
 * TODO: Improve styling of menu
 * @component
 * @param {object} props - The properties for the component.
 * @param {object} props.position - The position of the context menu.
 * @param {function} props.onDelete - The callback for deleting a table.
 * @param {function} props.onNameChange - The callback for changing a table's name.
 * @param {object} ref - The ref for the component.
 * @return {JSX.Element} The TableContextMenu component.
 */
const TableContextMenu = ({ tableData, onDelete: deleteTable, onChangeName: changeName, position, contextMenuRef, rotateTable }) => {

  return (
    <div className={styles.contextMenu} ref={contextMenuRef} style={{
      position: 'absolute',
      top: position.y - 99,
      left: position.x,
    }}>
      <ul className={styles.ul}>
        <li className={styles.li} onClick={() => deleteTable(tableData.id)}>Delete Table</li>
        <li className={styles.li} onClick={() => changeName(tableData, "Table X")}>Change Name</li>
        <li className={styles.li} onClick={() => rotateTable(tableData)}>Rotate Table</li>
      </ul>
    </div>
  );
};// end TableContextMenu()

export default TableContextMenu;