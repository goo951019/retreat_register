import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import {group_KorToEng, sleepingArea_KorToEng} from './Translator';

// addManyParticipants
async function addManyParticipants(rowData){
    await window.api.addManyParticipants({rowData :rowData})
    .then(() => { 
      smalltalk.alert('Success', rowData.length +' participant(s) are registered!');
    })
}

//Table Management
const columns = [
  {dataField: 'no', text:'No', formatter: (cell, row, rowIndex, formatExtraData) => {
    return rowIndex + 1;
  }, sort: true, headerStyle: {width: '35px'}, align:'center'},
  {dataField: 'church', text: 'Church', sort: true, headerStyle: {width: '110px'}},
  {dataField: 'kor_name', text: 'Name(Kor)', sort: true, headerStyle: {width: '90px'} },
  {dataField: 'eng_name',text: 'Name(Eng)', sort: true, headerStyle: {width: '130px'}},
  {dataField: 'group_name',text: 'Group', sort: true, headerStyle: {width: '100px'},align:'center'},
  {dataField: 'language',text: 'Language', sort: true, headerStyle: {width: '100px'}},
  {dataField: 'gender',text: 'Gender', sort: true, headerStyle: {width: '65px'}, align:'center'},
  {dataField: 'is_guest',text: 'Guest?', sort: true, headerStyle: {width: '60px'}, align:'center'},
  {dataField: 'fee',text: 'Fee($)', sort: true, headerStyle: {width: '55px'}, align:'center'},
  {dataField: 'remark',text: 'Remark', sort: true, headerStyle: {width: '170px'}},
];

// Registration Many Page
function RegistrationManyPage() {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState(null);

  const [file, setFile] = useState();
  const fileReader = new FileReader();

  useEffect(() => {
  });

  const selectRow = {
    mode: 'checkbox',
    hideSelectColumn: true,
    clickToSelect: false,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
    onSelect: (row, isSelect) => {
    },
    onSelectAll: (isSelect, rows) => {
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            const csvOutput = event.target.result;
            const rows = csvOutput.split(/\r?\n/);
            rows.shift(); // removes the first element of rows array, which was column name
            //console.log(rows);
            let storeData = [];
            let index = 1;
            rows.map((r)=>{
                const column = r.split(',');
                const sleepingArea = column[9]==="수양관"? column[10] 
                                    : column[9] === "차량" || column[9] === "호텔" || column[9] === "텐트" ? column[9] 
                                    : column[10];
                const speakKorean = column[4].toUpperCase().includes("KR") ? "Y" : "N";
                const speakEnglish = column[4].toUpperCase().includes("EN") ? "Y" : "N";
                const speakSpanish = column[4].toUpperCase().includes("SP") ? "Y" : "N";
                const speakChinese = column[4].toUpperCase().includes("CH") ? "Y" : "N";
                //console.log(column);
                storeData.push({temp_key: index, church: column[0].toUpperCase(), kor_name: column[1], eng_name: column[2], gender: column[3],
                    speak_korean: speakKorean, speak_english: speakEnglish, speak_spanish: speakSpanish, speak_chinese: speakChinese, language: column[4],
                    group_name: group_KorToEng(column[6]), is_guest: column[7]==="TRUE"?"Y":"N", fee: column[8] === '' || column[8] === '-' ? 0 : column[8].replace('$',''),
                    kor_sleeping_area: sleepingArea, eng_sleeping_area: sleepingArea_KorToEng(sleepingArea), remark: column[11]
                });
                index++;
                return'';
            })
            setRowData(storeData);
        };  
        fileReader.readAsText(file);
    }else{
        smalltalk.alert('Error', 'Please import csv file!');
    }
  }

  const handleClear = (e) =>{
    setFile(null);
    setRowData(null);
    document.getElementById("file-input").value = "";
  }

  const handleRegisterAll = (e) =>{
      if(rowData !== null && rowData.length !== 0){
        addManyParticipants(rowData).then(()=>{
            handleClear();
            navigate(-1);
        });
      }else{
        smalltalk.alert('Error', 'There is no data to add!');
      }
    
  }

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Registration (Many)</h1>
        <Container fluid className="w-100 p-0">
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => {handleClear(); navigate(-1); }}>Go Back</Button>
          <input type="file" id="file-input" accept={".csv"} onClick={handleClear} onChange={(e) => {setFile(e.target.files[0]);}}/>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleAdd}>Add to Table</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleClear}>Clear</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleRegisterAll}>Register All</Button>
        </Container>
      </div>
      <div style={{overflowY: 'scroll', width: '96vw', height: '75vh'}} >
        {rowData !== null ? <BootstrapTable keyField='temp_key' data={rowData} columns={ columns } selectRow={ selectRow } /> : <p>Please import csv</p>} 
      </div>
    </Container>
  );
}

export default RegistrationManyPage;