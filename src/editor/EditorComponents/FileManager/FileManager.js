import { useState } from "react";
import styles from "./FileManager.module.css";
import { uploadFloorLayout } from "../../../utils/StoreData";

const FileManager = () => {
  const [fileName, setFileName] = useState("");

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleFileSubmit = (event) => {

  };


  /**Gets the current date to be uploaded in the form yyyy-mm-dd */
  const getCurrentDate = () => {
    const date = new Date();
  
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() returns month index starting from 0
    let day = date.getDate();
  
    // add leading zeros to the month and day if necessary
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
  
    return `${year}-${month}-${day}`;
  }

  const uploadFloorPlan = (objectData, fileName, ) => {
    const data = {
      'dateCreated': getCurrentDate(),
      'name': 'Example Name',
      'venue': "Liberty Grand",
      'object-data': objectData,
    };
    uploadFloorLayout(JSON.stringify(data));
  };

  return (
    <div className={styles.container}> 
      <div className={styles.contents}>
        <h2>Save As</h2>
        <input type="text" value={fileName} onChange={handleFileNameChange} onSubmit={handleFileSubmit}/>
      </div>
      
    </div>
  );
}

export default FileManager;