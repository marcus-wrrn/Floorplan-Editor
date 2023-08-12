import React, { useEffect, useState } from "react";

/**
 * The FloorLayout functional component allows the user to view and interact with a floor layout image. 
 * The image can be rotated, scaled, and repositioned within the container. 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.floorLayout - The source of the floor layout image.
 * @param {number} props.scaleBy - The factor by which to scale the floor layout image. A value of 1 corresponds to the original size, a value of 0 to no size, and a value of 5 to five times the original size.
 * @param {number} props.rotateBy - The degrees by which to rotate the floor layout image. Valid values are between 0 and 360.
 * @param {Object} props.position - The coordinates to reposition the floor layout image. The object has 'x' and 'y' properties.
 * @param {Function} props.onClick - The function to be called when the floor layout image is clicked.
 */
const FloorLayout = ({floorLayout, scaleBy, rotateBy, position, onClick}) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (rotateBy > 360) {
      setRotation(360);
    } else if (rotateBy < 0) {
      setRotation(0);
    } else {
      setRotation(rotateBy)
    }
  }, [rotateBy]);

  const maxScale = 5;
  useEffect(() => {
    if (scaleBy > maxScale) {
      setScale(maxScale);
    } else if (scaleBy < 0){
      setScale(0);
    } else {
      setScale(scaleBy);
    }
  }, [scaleBy]);

  const layoutStyle = {
    position: 'absolute',
    padding: '10px',
  };

  const floorStyle = {
    width: '90%',
    left: '50px',
  };

  return (
    <div className='editorscreen-floorplan-container' style={{...layoutStyle, transform: `rotate(${rotation}deg) translate(${position.x}px, ${position.y}px) scale(${scale})`}} >
        <img style={floorStyle} src={floorLayout} alt='floorplan-layout' onClick={onClick} draggable={false}/>
    </div>
  );
};

export default FloorLayout