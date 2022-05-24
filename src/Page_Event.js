import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

async function requestAllEvent(){
  await window.api.requestAllEvent();
}

//Button functions 
function createEvent(){
  smalltalk
    .prompt('Enter name of the Event', '', '')
    .then(async (value) => {
        if(value === ''){
          smalltalk.alert('Error', 'Please Enter Name!');
        }else{
          await window.api.createEvent({event_name: value}).then(() => { 
            requestAllEvent(); 
            smalltalk.alert('Success', '"'+ value +'" is Created!');
          })
        }
    }).catch(()=>{});
}

let selectedEvent_id = null;
let selectedEvent_name = null;
let selectedisCurrent = null;
function clearSelected(){
  selectedEvent_id = null;
  selectedEvent_name = null;
  selectedisCurrent = null;
}
async function setCurrentEvent(){
  if(selectedisCurrent === 'Y'){
    smalltalk.alert('Info','Event is already current!');
    return;
  }
  if(selectedEvent_id != null){
    await window.api.setCurrentEvent({event_id: selectedEvent_id}).then(() => {
       requestAllEvent(); 
       selectedisCurrent = "Y";
    })
  }else{
    smalltalk.alert('Info','Event is not selected!');
  }
}

function deleteEvent(){
  if(selectedisCurrent === "Y"){
    smalltalk.alert('Info','Cannot remove current event!');
    return;
  }
  if(selectedEvent_id != null){
    smalltalk.prompt('Question', 'ARE YOU SURE ABOUT REMOVING: '+ selectedEvent_name +'?\nEnter Secret Password :')
    .then(async (value) => {
        // if you are seeing the sources code, this is the password.
        if(value === "1234"){
          await window.api.deleteEvent({event_id: selectedEvent_id}).then(() => { 
            requestAllEvent(); 
            smalltalk.alert('Success', '"'+ selectedEvent_name +'" is Deleted!');
            clearSelected();
          })
        }else{
          smalltalk.alert('Info','Wrong Password!');
        }
    });
  }else{
    smalltalk.alert('Info','Event is not selected!');
  }
}

//Table Management
const columns = [{
  dataField: 'event_id',
  text: 'Event ID'
}, {
  dataField: 'event_name',
  text: 'Event Name'
}, {
  dataField: 'isCurrent',
  text: 'IsSelected?'
}];

// Event Page
function EventPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if(event == null) window.api.requestAllEvent();
    window.api.getAllEvent(data => {
      if(isMounted) setEvent(data);
    });

    return () => {isMounted = false;};
  });

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, rowIndex) => {
      selectedEvent_id = row.event_id; 
      selectedEvent_name = row.event_name;
      selectedisCurrent = row.isCurrent; 
    }
  };

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Event Management</h1>
        <h4 style={{fontSize: '3vh'}}>Current Event is : {event != null ? event.filter(a=>a.isCurrent==='Y')[0].event_name : ''}</h4>
        <Container>
          <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg" onClick={() => { clearSelected(); navigate(-1);}}>Go Back</Button>
          <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg" onClick={createEvent}>Create Event</Button>
          <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg"onClick={setCurrentEvent}>Select Event</Button>
          <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-danger" size="lg" onClick={deleteEvent}>Delete Event</Button>
        </Container>
      </div>
      <div style={{overflowY: 'scroll', width: '96vw', height: '70vh'}} >
        {event != null ? <BootstrapTable keyField='event_id' data={ event } columns={ columns } selectRow={ selectRow } /> : <p>No Event Found</p>} 
      </div>
    </Container>
  );
}

export default EventPage;