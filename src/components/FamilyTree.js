import React from "react";
import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";


const containerStyles = {
  width: "100%",
  height: "50vh",
  border: "1px solid black"
};


const Card = ({ nodeData }) => (
  <div>
    <div className="card">
      <div className="card-body">
        <h5 style={{ margin: "5px" }} className="card-title">
          {nodeData.attributes.title}
        </h5>
        <h6 style={{ margin: "5px" }} className="card-subtitle mb-2 text-muted">
          {nodeData.attributes.subtitle}
        </h6>
        <p style={{ margin: "5px" }} className="card-text">
          {nodeData.attributes.text}
        </p>
      </div>
    </div>
  </div>
);


const click = event => {
};

const over = event => {
};

//family : authorName
let FamilyTree = (props) => {

  let [translateX, setTranslateX] = useState(0);
  let [translateY, setTranslateY] = useState(0);
  let treeContainer = useRef(null);
  let state = {}; // translateX translateY 
  let height = 200;
  let width = 500;
  let yOffset = 80;
  let yClearance = 150;

  useEffect(() => {
    
      const dimensions = treeContainer.getBoundingClientRect();
      setTranslateX(dimensions.width / 2)
      setTranslateY(yOffset)
  }, [])

    const data = {
        spouse: props.family[0].spouse?.value,
        children: props.family[0].children?.value.split(";"),
      };


  let author = {
    name: props.authorName,
  };

  let children = [];
  data.children.forEach((child) => {
    children.push({
      name: child,
    });
  });

  author.children = children;
  if (data.spouse) {
    author = [author, {
      name: data.spouse,
      children: children
    }]
  } else {
    author = [author]
  }
  let dataTree = author;

  



  return (
    <div style={containerStyles} ref={tc => (treeContainer = tc)}>
      <Tree
        data={dataTree}
        collapsible={false}
        translate= {{
          x: translateX,
          y: translateY
        }} 
        scaleExtent={{ min: 0.1, max: 3 }}
        allowForeignObjects
        pathFunc="elbow"
        orientation="vertical"
        nodeSvgShape={{ shape: "none" }}
        nodeSize={{ x: 300, y: yClearance }}
        onClick={e => click(e)}
        onMouseOver={e => over(e)}
        nodeLabelComponent={{
          render: <Card />,
          foreignObjectWrapper: {
            style: {
              background: "lightblue",
              border: "1px solid black",
              width: width.toString() + "px",
              height: height.toString() + "px",
              x: width / -2,
              y: height / -2
            }
          }
        }}
      />
    </div>
  );
}

export default FamilyTree;
