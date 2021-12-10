 import * as React from 'react';
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';

function TimelineElement(props) {
    console.log("data rendered" + JSON.stringify(props.data));
    return (
        <React.Fragment>
            <Timeline position="alternate">     
                    {props.data.map((obj) => {
                        let value = <MenuBookTwoToneIcon />;
                        if(obj.type === "birth"){
                            value = <CakeTwoToneIcon />;
                        } else if(obj.type === "death") {
                            value = <LocalFireDepartmentTwoToneIcon />;
                        } 
                        return (
                        <TimelineItem key={obj.date + " "+ obj.work}>
                            <TimelineOppositeContent color="text.secondary">
                                {obj.date}
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot>
                                    {value}   
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent>{obj.work}</TimelineContent>
                        </TimelineItem>
                        )
                    })}      
            </Timeline>
        </React.Fragment>
    );
}

export default TimelineElement;
