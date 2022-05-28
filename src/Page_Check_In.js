import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button, Form } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';

async function requestCurrentParticipants(){
  await window.api.requestCurrentParticipants();
}

async function checkInManyParticipants(){
    await window.api.checkInManyParticipants({p_id : [...selected.keys()]}).then(() => { 
        requestCurrentParticipants();
        smalltalk.alert('Success', selected.size +' participant(s) are checked in!');
      })
}

async function markAsPaidParticipants(){
    await window.api.markAsPaidParticipants({p_id : [...selected.keys()]}).then(() => { 
        requestCurrentParticipants();
        smalltalk.alert('Success', selected.size +' participant(s) are marked as paid!');
      })
}

async function checkInParticipant(barcode, name){
    await window.api.checkInParticipant({barcode : barcode})
        .then(() => { 
            smalltalk.alert('Success', '"'+name+'" is Checked In!').then(function() {document.getElementById("barcode-input").focus()});
        });
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
  const filter9 = document.getElementById('text-filter-column-is_checked_in').parentElement;
  if(filter1.childElementCount === 2){
    filter1.removeChild(filter1.firstChild);
    filter2.removeChild(filter2.firstChild);
    filter3.removeChild(filter3.firstChild);
    filter4.removeChild(filter4.firstChild);
    filter5.removeChild(filter5.firstChild);
    filter6.removeChild(filter6.firstChild);
    filter7.removeChild(filter7.firstChild);
    filter8.removeChild(filter8.firstChild);
    filter9.removeChild(filter9.firstChild);
  }
}

//Table Management
const columns = [
  {dataField: 'no', text:'No', formatter: (cell, row, rowIndex, formatExtraData) => {
    return rowIndex + 1;
  }, sort: true, headerStyle: {width: '35px'}, align:'center'},
  {dataField: 'church', text: 'Church', sort: true, headerStyle: {width: '110px'}, filter: textFilter()},
  {dataField: 'kor_name', text: 'Name(Kor)', sort: true, headerStyle: {width: '90px'}, filter: textFilter() },
  {dataField: 'eng_name',text: 'Name(Eng)', sort: true, headerStyle: {width: '130px'}, filter: textFilter()},
  {dataField: 'group_name',text: 'Group', sort: true, headerStyle: {width: '100px'},align:'center', filter: textFilter()},
  {dataField: 'gender',text: 'Gender', sort: true, headerStyle: {width: '65px'}, align:'center', filter: textFilter()},
  {dataField: 'is_guest',text: 'Guest?', sort: true, headerStyle: {width: '60px'}, align:'center', filter: textFilter()},
  {dataField: 'fee',text: 'Fee($)', sort: true, headerStyle: {width: '55px'}, align:'center', filter: textFilter({comparator: Comparator.EQ})},
  {dataField: 'is_fee_paid',text: 'Paid?', sort: true, headerStyle: {width: '50px'}, align:'center', filter: textFilter()},
  {dataField: 'is_checked_in', text: 'Checked In?', sort: true, headerStyle: {width: '95px'}, align:'center', filter: textFilter()},
  {dataField: 'remark',text: 'Remark', sort: true, headerStyle: {width: '170px'}},
];

// stores selected rows
const selected = new Map();

// Registration Page
function CheckInPage() {
  const navigate = useNavigate();
  const [participants, setParticipant] = useState(null);
  const [checkInMode, setCheckInMode] = useState(false);
  const [totalFeePaid, setTotalFeePaid] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if(participants == null) window.api.requestCurrentParticipants();
    if(participants !== null) {removeSpan();}
    window.api.getCurrentParticipants(data => {if(isMounted) setParticipant(data);})
    return () => {isMounted = false;};
  });

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
        selected.clear();
        return '';
      })
    }
  }

  const handleCheckIn = () => {
    if(selected.size !== 0){
        checkInManyParticipants();
    }else{
        smalltalk.alert('Error', 'Nothing is selected!');
    }
  }

  const handleCheckInMode = (event) => {
    if(checkInMode===false) setCheckInMode(true); 
    else setCheckInMode(false); 
  }

  const handleEnter = (event) => {
      if(event.key === "Enter"){
        let isFound = false;
        participants.map((p) => {
            // check if barcode exists
            if(event.target.value === p.barcode){
                let name = p.kor_name === '' ? p.eng_name : p.eng_name === '' ? p.kor_name : p.kor_name +" ("+p.eng_name+")";
                isFound = true;
                // check if person is already checked in
                if(p.is_checked_in === "Y") smalltalk.alert('Info', '"'+name+'" is already checked in!').then(function() {document.getElementById("barcode-input").focus()});
                else checkInParticipant(p.barcode, name);
            }
            return '';
        })
        if(!isFound) smalltalk.alert('Info', '"'+event.target.value + '" is not Found!').then(function() {document.getElementById("barcode-input").focus()});
        else requestCurrentParticipants().then(()=>{if(event.target !== null) event.target.focus(); });
        event.target.value=""
      }
  }

  const handleMarkAsPaid = () => {
    if(selected.size !== 0){
        markAsPaidParticipants();
    }else{
        smalltalk.alert('Error', 'Nothing is selected!');
    }
  }

  const selectRow = {
    mode: 'checkbox', 
    clickToSelect: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, isSelect) => {
      if(isSelect){
          selected.set(row.p_id, row);
          setTotalFeePaid(totalFeePaid + row.fee);
      }else{
          selected.delete(row.p_id);
          setTotalFeePaid(totalFeePaid - row.fee);
      }
    },
    onSelectAll: (isSelect, rows) => {
      if(isSelect) {
          let total=0;
          rows.map((r) => {selected.set(r.p_id, r); total+=r.fee; return'';});
          setTotalFeePaid(total);
      }else{
          selected.clear();
          setTotalFeePaid(0);
      }
    }
  };

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Check In</h1>
        <Container fluid className="w-100 p-0">
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => {selected.clear(); navigate(-1);}}>Go Back</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleCheckIn}>Check In</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleCheckInMode}>Check In Mode</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleMarkAsPaid}>Mark "${totalFeePaid}" as Paid</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleEdit}>Edit</Button>
        </Container>
        {checkInMode ? 
        <Container className="w-50">
            <Form.Control id="barcode-input" className="text-center" type="text" placeholder="Scan Barcode Here" style={{fontSize:'3vh', alignText:'center'}} onKeyPress={handleEnter}/>
        </Container> 
        : null 
        }
      </div>
      <div style={{overflowY: 'scroll', width: '96vw', height: '70vh'}} >
        {participants != null ? 
        <BootstrapTable keyField='p_id' data={participants} columns={ columns } selectRow={ selectRow } filter={ filterFactory()} /> 
        : <p>Loading...</p>} 
      </div>
    </Container>
  );
}

export default CheckInPage;