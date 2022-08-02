import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';

async function requestCurrentParticipants(){
  console.log(await window.api.requestCurrentParticipants2({current_event_id: window.current_event_id}));
}

function deleteParticipants(){
  if(selected.size !== 0){
    smalltalk.prompt('Question', 'ARE YOU SURE ABOUT REMOVING SELECTED '+ selected.size +' PARTICIPANTS?\nEnter Secret Password :')
    .then(async (value) => {
        // if you are seeing the sources code, this is the password.
        if(value === "1234"){
          await window.api.deleteParticipant({p_id : [...selected.keys()]}).then(() => { 
            requestCurrentParticipants();
            smalltalk.alert('Success', selected.size +' participant(s) delete complete!');
            selected.clear()
          })
        }else{ smalltalk.alert('Info','Wrong Password!');}
    });
  }else{smalltalk.alert('Error','Nothing is selected!');}
}

// this is for removing unnecessary text from filter.
function removeSpan(){
  const filter1 = document.getElementById('text-filter-column-church').parentElement;
  const filter2 = document.getElementById('text-filter-column-kor_name').parentElement;
  const filter3 = document.getElementById('text-filter-column-eng_name').parentElement;
  const filter4 = document.getElementById('text-filter-column-group_name').parentElement;
  const filter5 = document.getElementById('text-filter-column-gender').parentElement;
  const filter6 = document.getElementById('text-filter-column-is_guest').parentElement;
  const filter7 = document.getElementById('text-filter-column-fee').parentElement;
  const filter8 = document.getElementById('text-filter-column-is_fee_paid').parentElement;
  if(filter1.childElementCount === 2){
    filter1.removeChild(filter1.firstChild);
    filter2.removeChild(filter2.firstChild);
    filter3.removeChild(filter3.firstChild);
    filter4.removeChild(filter4.firstChild);
    filter5.removeChild(filter5.firstChild);
    filter6.removeChild(filter6.firstChild);
    filter7.removeChild(filter7.firstChild);
    filter8.removeChild(filter8.firstChild);
  }
}

//Table Management
const columns = [
  {dataField: 'no', text:'No', formatter: (cell, row, rowIndex, formatExtraData) => {
    return rowIndex + 1;
  }, sort: true, headerStyle: {width: '35px'}, align:'center'},
  {dataField: 'church', text: 'Church', sort: true, headerStyle: {width: '110px'}, filter: textFilter()},
  {dataField: 'kor_name', text: 'Name(Kor)', sort: true, headerStyle: {width: '90px'}, filter: textFilter()},
  {dataField: 'eng_name',text: 'Name(Eng)', sort: true, headerStyle: {width: '130px'}, filter: textFilter()},
  {dataField: 'group_name',text: 'Group', sort: true, headerStyle: {width: '100px'},align:'center', filter: textFilter()},
  {dataField: 'gender',text: 'Gender', sort: true, headerStyle: {width: '65px'}, align:'center', filter: textFilter()},
  {dataField: 'is_guest',text: 'Guest?', sort: true, headerStyle: {width: '60px'}, align:'center', filter: textFilter()},
  {dataField: 'fee',text: 'Fee($)', sort: true, headerStyle: {width: '55px'}, align:'center', filter: textFilter({comparator: Comparator.EQ})},
  {dataField: 'is_fee_paid',text: 'Paid?', sort: true, headerStyle: {width: '50px'}, align:'center', filter: textFilter()},
  {dataField: 'remark',text: 'Remark', sort: true, headerStyle: {width: '170px'}},
];

// stores selected rows
const selected = new Map();

// Registration Page
function RegistrationPage() {
  const navigate = useNavigate();
  const [participants, setParticipant] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if(participants === null) {requestCurrentParticipants()}
    if(participants !== null) {removeSpan();}
    window.api.getCurrentParticipants(data => {  if(isMounted){setParticipant(data);} })
    return () => {isMounted = false;};
  });

  const handlePrint = () => {
    if(selected.size === 0){
      smalltalk.alert('Error', 'Nothing is selected!');
      return;
    }
    // pass selected rows to print screen
    navigate('/print', {state : selected});
    selected.clear();
  }

  const handleEdit = () => {
    if(selected.size === 0){
      smalltalk.alert('Error', 'Nothing is selected!');
      return;
    }else if (selected.size !== 1){
      smalltalk.alert('Error', 'Please selected single row!');
      return;
    }else if(selected.size === 1){
      [...selected.keys()].map((key,index)=>{
        navigate('/edit', {state : selected.get(key)});
        return '';
      })
      selected.clear();
    }
  }

  const selectRow = {
    mode: 'checkbox', 
    clickToSelect: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, isSelect) => {
      if(isSelect) selected.set(row.p_id, row);
      else selected.delete(row.p_id);
    },
    onSelectAll: (isSelect, rows) => {
      if(isSelect) rows.map((r) => selected.set(r.p_id, r));
      else selected.clear();
    },
  };

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Registration</h1>
        <Container fluid className="w-100 p-0">
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => {selected.clear(); navigate(-1);}}>Go Back</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => {if(window.current_event_id === -1){smalltalk.alert("Wanring","No Event Selected")}else{navigate('/register-new'); selected.clear();}}}>Register</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => {if(window.current_event_id === -1){smalltalk.alert("Wanring","No Event Selected")}else{navigate('/register-many'); selected.clear();}}}>Register (Many)</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleEdit}>Edit</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handlePrint}>Make PDF</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-danger" size="lg" onClick={deleteParticipants}>Delete Registration</Button>
        </Container>
      </div>
      <div style={{overflowY: 'scroll', width: '96vw', height: '75vh'}} >
        {participants != null ? 
        <BootstrapTable keyField='p_id' data={participants} columns={ columns } selectRow={ selectRow } filter={ filterFactory() }/> 
        : <p>Loading...</p>} 
      </div>
    </Container>
  );
}

export default RegistrationPage;