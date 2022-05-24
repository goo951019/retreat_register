import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

async function requestAllChurch(){
  await window.api.requestAllChurch();
}

async function requestAllSleeping_Area(){
    await window.api.requestAllSleeping_Area();
}

//Button functions 
function addChurch(){
    smalltalk
        .prompt('Enter Church Name: ', '', '')
        .then(async (value) => {
            if(value === ''){
              smalltalk.alert('Error', 'Please Enter Something!');
            }else{
              await window.api.addChurch({church_name: value.toUpperCase()}).then(() => { 
                requestAllChurch(); 
                smalltalk.alert('Success', '"'+ value +'" is Created!');
              })
            }
        }).catch(()=>{});
}

async function hideChurch(){
  if(selectedChurch.size !== 0){
    await window.api.hideChurch({c_id : [...selectedChurch.keys()]}).then(() => { 
      requestAllChurch(); 
      selectedChurch.clear();
      window.location.reload(false);
    })
  }else{smalltalk.alert('Error','Nothing is selected!');}
}

async function showChurch(){
  if(selectedChurch.size !== 0){
    await window.api.showChurch({c_id : [...selectedChurch.keys()]}).then(() => { 
      requestAllChurch(); 
      selectedChurch.clear();
      window.location.reload(false);
    })
  }else{smalltalk.alert('Error','Nothing is selected!');}
}

function deleteChurch(){
    if(selectedChurch.size !== 0){
        smalltalk.prompt('Question', 'ARE YOU SURE ABOUT REMOVING SELECTED '+ selectedChurch.size +' CHURCH(ES)?\nEnter Secret Password :')
        .then(async (value) => {
            // if you are seeing the sources code, this is the password.
            if(value === "1234"){
              await window.api.deleteChurch({c_id : [...selectedChurch.keys()]}).then(() => { 
                requestAllChurch();
                smalltalk.alert('Success', selectedChurch.size +' church(es) delete complete!');
                selectedChurch.clear()
                window.location.reload(false);
              })
            }else{ smalltalk.alert('Info','Wrong Password!');}
        });
      }else{smalltalk.alert('Error','Nothing is selected!');}
}

function addSleeping_Area(){
    var koreanName="";
    smalltalk
    .prompt('Enter Sleeping Area Name (Korean) ', '', '')
    .then((value) => {
        if(value === ''){
          smalltalk.alert('Error', 'Please Enter Something!');
        }else{
            koreanName=value;
            smalltalk
                .prompt('Enter Sleeping Area Name (English)', '', '')
                .then(async (value) => {
                    if(value === ''){
                        smalltalk.alert('Error', 'Please Enter Something!');
                    }else{
                        await window.api.addSleeping_Area({kor_sleeping_area: koreanName, eng_sleeping_area: value}).then(() => { 
                            requestAllSleeping_Area(); 
                            smalltalk.alert('Success', '"'+ koreanName+":"+ value +'" is Created!');
                        })
                    }
            }).catch(()=>{});
        }
    }).catch(()=>{});

}

async function hideSleeping_Area(){
  if(selectedSleeping_Area.size !== 0){
    await window.api.hideSleeping_Area({s_id : [...selectedSleeping_Area.keys()]}).then(() => { 
      requestAllSleeping_Area(); 
      selectedSleeping_Area.clear();
      window.location.reload(false);
    })
  }else{smalltalk.alert('Error','Nothing is selected!');}
}
async function showSleeping_Area(){
  if(selectedSleeping_Area.size !== 0){
    await window.api.showSleeping_Area({s_id : [...selectedSleeping_Area.keys()]}).then(() => { 
      requestAllSleeping_Area(); 
      selectedSleeping_Area.clear();
      window.location.reload(false);
    })
  }else{smalltalk.alert('Error','Nothing is selected!');}
}
function deleteSleeping_Area(){
  if(selectedSleeping_Area.size !== 0){
    smalltalk.prompt('Question', 'ARE YOU SURE ABOUT REMOVING SELECTED '+ selectedSleeping_Area.size +' SLEEPING AREA(S)?\nEnter Secret Password :')
    .then(async (value) => {
        // if you are seeing the sources code, this is the password.
        if(value === "1234"){
          await window.api.deleteSleeping_Area({s_id : [...selectedSleeping_Area.keys()]}).then(() => { 
            requestAllSleeping_Area();
            smalltalk.alert('Success', selectedSleeping_Area.size +' sleeping_area(s) delete complete!');
            selectedSleeping_Area.clear()
            window.location.reload(false);
          })
        }else{ smalltalk.alert('Info','Wrong Password!');}
    });
  }else{smalltalk.alert('Error','Nothing is selected!');}
}

//Table Management
const churchTable = [{
  dataField: 'c_id',
  text: 'Church ID'
}, {
  dataField: 'church_name',
  text: 'Name'
}, {
  dataField: 'isHidden',
  text: 'IsHidden?'
}];

const sleeping_areaTable = [{
    dataField: 's_id',
    text: 'Event ID'
  }, {
    dataField: 'kor_sleeping_area',
    text: 'In Kor'
  }, {
    dataField: 'eng_sleeping_area',
    text: 'In Eng'
  }, {
    dataField: 'isHidden',
    text: 'IsHidden?'
  }
];

// stores selected rows
const selectedChurch = new Map();
const selectedSleeping_Area = new Map();
function clearSelected(){
  selectedChurch.clear();
  selectedSleeping_Area.clear();
}

// Setting Page
function SettingPage() {
  const navigate = useNavigate();
  const [church, setChurch] = useState(null);
  const [sleeping_area, setSleeping_Area] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if(church == null) window.api.requestAllChurch();
    if(sleeping_area == null) window.api.requestAllSleeping_Area();
    
    window.api.getAllChurch(data => { if(isMounted) setChurch(data);});
    window.api.getAllSleeping_Area(data => {if(isMounted) setSleeping_Area(data);});

    return () => {isMounted = false;};
  });

  const selectChurch = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, isSelect) => {
        if(isSelect) selectedChurch.set(row.c_id, row);
        else selectedChurch.delete(row.c_id);
    }
  };

  const selectSleeping_Area = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, isSelect) => {
        if(isSelect) selectedSleeping_Area.set(row.s_id, row);
        else selectedSleeping_Area.delete(row.s_id);
    }
  };

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <Row>
            <Col xs lg={2}>
                <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg" onClick={() => {clearSelected(); navigate(-1);}}>Go Back</Button>
            </Col>
            <Col>
            </Col>
        </Row>
        <Row>
            <Col>
                <h2 style={{fontSize: '6vh'}}>Church</h2>
                <Container>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg" onClick={addChurch}>Add</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg"onClick={hideChurch}>Hide</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg"onClick={showChurch}>Show</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-danger" size="lg" onClick={deleteChurch}>Delete</Button>
                </Container>
                <div style={{overflowY: 'scroll', height: '65vh'}} >
                    {church != null ? <BootstrapTable keyField='c_id' data={ church } columns={ churchTable } selectRow={ selectChurch } /> : <p>No Church Found</p>} 
                </div>
            </Col>
            <Col xs lg='7'>
                <h2 style={{fontSize: '6vh'}}>Sleeping Area</h2>
                <Container>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg" onClick={addSleeping_Area}>Add</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg"onClick={hideSleeping_Area}>Hide</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-primary" size="lg"onClick={showSleeping_Area}>Show</Button>
                    <Button style={{fontSize: '2.5vh'}} className="m-2" variant="outline-danger" size="lg" onClick={deleteSleeping_Area}>Delete</Button>
                </Container>
                <div style={{overflowY: 'scroll', height: '65vh'}} >
                    {sleeping_area != null ? <BootstrapTable keyField='s_id' data={ sleeping_area } columns={ sleeping_areaTable } selectRow={ selectSleeping_Area } /> : <p>No Sleeping Area Found</p>} 
                </div>
            </Col>
        </Row>
      </div>
    </Container>
  );
}

export default SettingPage;