import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import {group_KorToEng} from './Translator';

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
  {dataField: 'language',text: 'Lang', sort: true, headerStyle: {width: '50px'}},
  {dataField: 'eng_sleeping_area',text: 'Sleeping Area', sort: true, headerStyle: {width: '150px'}},
  {dataField: 'gender',text: 'Gender', sort: true, headerStyle: {width: '65px'}, align:'center'},
  {dataField: 'is_guest',text: 'Guest?', sort: true, headerStyle: {width: '60px'}, align:'center'},
  {dataField: 'fee',text: 'Fee($)', sort: true, headerStyle: {width: '55px'}, align:'center'},
  {dataField: 'remark',text: 'Remark', sort: true, headerStyle: {width: '170px'}},
];

// Registration Many Page
function RegistrationManyPage() {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState(null);
  const [churchList, setChurchList] = useState(null);
  const [sleepingAreaList, setSleepingAreaList] = useState(null);
  let churchNotFound = [];
  let sleepingAreaNotFound = [];

  const [file, setFile] = useState();
  const fileReader = new FileReader();

  useEffect(() => {
    let isMounted = true;
    if(churchList == null) window.api.requestVisibleChurch();
    if(sleepingAreaList == null) window.api.requestVisibleSleeping_Area();
    window.api.getVisibleChurch(data => {if(isMounted){setChurchList(data); } });
    window.api.getVisibleSleeping_Area(data => {if(isMounted){setSleepingAreaList(data); } });
    return () => {isMounted = false;};
  });

  const selectRow = {
    mode: 'checkbox', 
    hideSelectColumn: true,
    clickToSelect: false
  };

  const handleAdd = (e) => {
    e.preventDefault();
    churchNotFound=[];
    sleepingAreaNotFound=[];

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
                // converting values
                const churchName = column[0].toUpperCase();
                const sleepingArea = column[14];
                const sleepingAreaEng = sleepingAreaList.filter(s => s.kor_sleeping_area === sleepingArea).length !== 0 ? sleepingAreaList.filter(s => s.kor_sleeping_area === sleepingArea)[0].eng_sleeping_area : "";
                const speakKorean = column[4].toUpperCase().includes("KR") ? "Y" : "N";
                const speakEnglish = column[4].toUpperCase().includes("EN") ? "Y" : "N";
                const speakSpanish = column[4].toUpperCase().includes("SP") ? "Y" : "N";
                const speakChinese = column[4].toUpperCase().includes("CH") ? "Y" : "N";

                // stores church name not found
                if(!churchNotFound.includes(churchName) && churchList.filter(c => c.church_name === churchName).length === 0) churchNotFound.push(churchName);
                // stores sleeping area not found
                if(!sleepingAreaNotFound.includes(sleepingArea) && sleepingAreaList.filter(s => s.kor_sleeping_area === sleepingArea).length === 0){
                  console.log(column);
                  sleepingAreaNotFound.push(sleepingArea);
                }
                
                //console.log(column);

                storeData.push({temp_key: index, church: column[0].toUpperCase(), kor_name: column[1], eng_name: column[2], gender: column[3],
                    speak_korean: speakKorean, speak_english: speakEnglish, speak_spanish: speakSpanish, speak_chinese: speakChinese, language: column[4],
                    group_name: group_KorToEng(column[6]), is_guest: column[7]==="TRUE"?"Y":"N", fee: column[8] === '' || column[8] === '-' ? 0 : column[8].replace('$',''),
                    kor_sleeping_area: sleepingArea, eng_sleeping_area: sleepingAreaEng, remark: column[11]
                });
                index++; return'';
            })
          
          if(churchNotFound.length > 0) smalltalk.alert("Wanring","Following church(es) are not found, please adjust it: \n"+ churchNotFound);
          if(sleepingAreaNotFound.length > 0) smalltalk.alert("Wanring","Following sleeping area(s) are not found, please adjust it: \n"+ sleepingAreaNotFound);
          
          // all churches and sleeping areas should be found within the data
          if(churchNotFound.length === 0 && sleepingAreaNotFound.length === 0) setRowData(storeData);
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