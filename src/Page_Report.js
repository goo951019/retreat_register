import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useReactToPrint } from 'react-to-print';
import {numberFormat} from './Translator';

async function requestAccountingReport(){
    await window.api.requestAccountingReport();
}

async function requestLodgingReport(){
    await window.api.requestLodgingReport();
}

async function requestGroupReport(){
    await window.api.requestGroupReport();
}

async function requestLanguageReport(){
    await window.api.requestLanguageReport();
}

const { ExportCSVButton } = CSVExport;

//Table Management
const columns = [
  {dataField: 'church', text: 'Church', sort: true, headerStyle: {width: '140px'}},
  {dataField: 'father', text: 'Father', sort: true, headerStyle: {width: '50px'},align:'center'},
  {dataField: 'mother',text: 'Mother', sort: true, headerStyle: {width: '55px'},align:'center'},
  {dataField: 'young_adult',text: 'YA', sort: true, headerStyle: {width: '40px'},align:'center'},
  {dataField: 'youth_group',text: 'YG', sort: true, headerStyle: {width: '45px'}, align:'center'},
  {dataField: 'elementary',text: 'Elementary', sort: true, headerStyle: {width: '90px'}, align:'center'},
  {dataField: 'kindergarden',text: 'Kinder', sort: true, headerStyle: {width: '60px'}, align:'center'},
  {dataField: 'senior',text: 'Senior', sort: true, headerStyle: {width: '60px'}, align:'center'},
  {dataField: 'total_number', text: 'Total', sort: true, headerStyle: {width: '60px'}, align:'center'},
  {dataField: 'total_guest',text: 'Total Guest', sort: true, headerStyle: {width: '90px'}, align:'center'},
  {dataField: 'total_fee',text: 'Total Fee ($)', sort: true, headerStyle: {width: '170px'}, },
];

const columns_logding = [
    {dataField: 'eng_sleeping_area', text: 'Lodging', sort: true, headerStyle: {width: '170px'},align:'center'},
    {dataField: 'kor_sleeping_area', text: '숙소', sort: true, headerStyle: {width: '140px'},align:'center'},
    {dataField: 'atlanta',text: 'ATL', sort: true, headerStyle: {width: '50px'},align:'center'},
    {dataField: 'chicago',text: 'CHI', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'kentucky',text: 'KY', sort: true, headerStyle: {width: '45px'}, align:'center'},
    {dataField: 'michigan',text: 'MICH', sort: true, headerStyle: {width: '60px'}, align:'center'},
    {dataField: 'new_jersey',text: 'NJ', sort: true, headerStyle: {width: '45px'}, align:'center'},
    {dataField: 'new_york', text: 'NY', sort: true, headerStyle: {width: '45px'}, align:'center'},
    {dataField: 's_illinois',text: 'S. IL', sort: true, headerStyle: {width: '60px'}, align:'center'},
    {dataField: 's_virginia',text: 'S. VA', sort: true, headerStyle: {width: '60px'}, align:'center'},
    {dataField: 'washington',text: 'WA', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'other',text: 'Other', sort: true, headerStyle: {width: '60px'}, align:'center'},
    {dataField: 'total_number',text: 'Total', sort: true, headerStyle: {width: '65px'},align:'center'},
  ];

const columns_group = [
{dataField: 'group_name', text: 'Group', sort: true, headerStyle: {width: '170px'},align:'center'},
{dataField: 'atlanta',text: 'ATL', sort: true, headerStyle: {width: '50px'},align:'center'},
{dataField: 'chicago',text: 'CHI', sort: true, headerStyle: {width: '50px'}, align:'center'},
{dataField: 'kentucky',text: 'KY', sort: true, headerStyle: {width: '45px'}, align:'center'},
{dataField: 'michigan',text: 'MICH', sort: true, headerStyle: {width: '60px'}, align:'center'},
{dataField: 'new_jersey',text: 'NJ', sort: true, headerStyle: {width: '45px'}, align:'center'},
{dataField: 'new_york', text: 'NY', sort: true, headerStyle: {width: '45px'}, align:'center'},
{dataField: 's_illinois',text: 'S. IL', sort: true, headerStyle: {width: '60px'}, align:'center'},
{dataField: 's_virginia',text: 'S. VA', sort: true, headerStyle: {width: '60px'}, align:'center'},
{dataField: 'washington',text: 'WA', sort: true, headerStyle: {width: '50px'}, align:'center'},
{dataField: 'other',text: 'Other', sort: true, headerStyle: {width: '60px'}, align:'center'},
{dataField: 'total_number',text: 'Total', sort: true, headerStyle: {width: '65px'},align:'center'},
];

const columns_language = [
    {dataField: 'church', text: 'Church', sort: true, headerStyle: {width: '70px'},align:'center'},
    {dataField: 'KR',text: 'KR', sort: true, headerStyle: {width: '25px'},align:'center'},
    {dataField: 'EN',text: 'EN', sort: true, headerStyle: {width: '25px'}, align:'center'},
    {dataField: 'SP',text: 'SP', sort: true, headerStyle: {width: '25px'}, align:'center'},
    {dataField: 'CH',text: 'CH', sort: true, headerStyle: {width: '25px'}, align:'center'},
    {dataField: 'KR_EN',text: 'KR_EN', sort: true, headerStyle: {width: '35px'}, align:'center'},
    {dataField: 'KR_SP',text: 'KR_SP', sort: true, headerStyle: {width: '35px'}, align:'center'},
    {dataField: 'KR_CH',text: 'KR_CH', sort: true, headerStyle: {width: '35px'}, align:'center'},
    {dataField: 'EN_SP',text: 'EN_SP', sort: true, headerStyle: {width: '35px'}, align:'center'},
    {dataField: 'SP_CH',text: 'SP_CH', sort: true, headerStyle: {width: '35px'}, align:'center'},
    {dataField: 'KR_EN_SP',text: 'KR_EN_SP', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'KR_EN_CH',text: 'KR_EN_CH', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'KR_SP_CH',text: 'KR_SP_CH', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'EN_SP_CH',text: 'EN_SP_CH', sort: true, headerStyle: {width: '50px'}, align:'center'},
    {dataField: 'KR_EN_SP_CH',text: 'KR_EN_SP_CH', sort: true, headerStyle: {width: '65px'}, align:'center'},
    {dataField: 'total',text: 'Total', sort: true, headerStyle: {width: '30px'},align:'center'},
    ];

const MyExportSCV = (props) =>{
    const handleClick = () => {
        props.onExport();
      };
      return (
        <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={handleClick}>Language Report</Button>
      );
}

// Report Page
function ReportPage() {
  const navigate = useNavigate();
  const [accountingReport, setAccountingReport] = useState(null);
  const [lodgingReport, setLodgingReport] = useState(null);
  const [groupReport, setGroupReport] = useState(null);
  const [languageReport, setLanguageReport] = useState(null);
  const pdfRef = useRef(null);

  const resetReport = () => {
      setAccountingReport(null);
      setLodgingReport(null);
      setGroupReport(null);
      setLanguageReport(null);
  }

  useEffect(() => {
    let isMounted = true;
    window.api.getAccountingReport(data => {
        data.map((r)=>{r.total_fee= numberFormat(r.total_fee);});
        if(isMounted){ resetReport(); setAccountingReport(data)};
    })
    window.api.getLodgingReport(data => {if(isMounted) { resetReport(); setLodgingReport(data)};})
    window.api.getGroupReport(data => {if(isMounted) { resetReport(); setGroupReport(data)};})
    window.api.getLanguageReport(data => {if(isMounted) { resetReport(); setLanguageReport(data)};})
    return () => {isMounted = false;};
  });

  const handlePrint = useReactToPrint({content: () => pdfRef.current});

  const selectRow = {
    mode: 'radio', 
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: '#c8e6c9',
    style: { backgroundColor: '#c8e6c9' },
  };

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Report</h1>
        <Container fluid className="w-100 p-0">
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={() => navigate(-1)}>Go Back</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={requestAccountingReport} >Accounting Report</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={requestLodgingReport}>Lodging Report</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={requestGroupReport}>Group Report</Button>
          <Button style={{fontSize: '3vh'}} className="m-2" variant="outline-primary" size="lg" onClick={requestLanguageReport}>Language Report</Button>
        </Container>
      </div>
      <div style={{overflowY: 'scroll', width: '96vw', height: '70vh'}} ref={pdfRef}>
        {accountingReport != null ? <BootstrapTable keyField='church' data={accountingReport} columns={ columns } selectRow={ selectRow }/> 
        : lodgingReport != null ? <BootstrapTable keyField='eng_sleeping_area' data={lodgingReport} columns={ columns_logding } selectRow={ selectRow }/> 
        : groupReport != null ? <BootstrapTable keyField='group_name' data={groupReport} columns={ columns_group } selectRow={ selectRow }/> 
        : languageReport != null ? <BootstrapTable keyField='church' data={languageReport} columns={ columns_language } selectRow={ selectRow }/> 
        : <p>select report type...</p>} 
      </div>
    </Container>
  );
}

export default ReportPage;