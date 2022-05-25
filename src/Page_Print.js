import React, { useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row,Col, Button } from 'react-bootstrap';

import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";

import bg from './images/bg.png';
import bgBlue from './images/bg-blue.png';
import bgRed from './images/bg-red.png';
import lodging from './images/lodge.png';

const backgroundBlue = {
    backgroundImage: `url(${bgBlue})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '283px',
    width: '405px',
    margin : '0',
    padding: '5px'
}

const backgrounRed = {
    backgroundImage: `url(${bgRed})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '285px',
    width: '405px',
    margin : '0',
    padding: '5px'
}
const lodgingImage = {
    backgroundImage: `url(${lodging})`,
    backgroundRepeat: 'no-repeat',
    width: '20px',
    height: '40px',
    backgroundSize: 'contain',
    marginTop : '10px',
    marginLeft: '0'
}
const rowPagebreak = {
    pageBreakBefore: 'always'
}
const rowPadding = {
    paddingLeft: '10px'
}
const rowFirst = {
    paddingTop: '10px'
}

// Print Page
function PrintPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const listOfPeople = location.state;
  const pdfRef = useRef();

  const handlePrint = useReactToPrint({content: () => pdfRef.current});

  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h1 style={{fontSize: '8vh'}}>Print</h1>
        <Container fluid className="w-100 p-0">
            <Button style={{fontSize: '3vh',zIndex: 999}} className="m-3" variant="outline-primary" size="lg" onClick={() => navigate(-1)}>Go Back</Button>
            <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg" onClick={handlePrint}>Print</Button>
        </Container>
        <Container style={{overflowY: 'scroll', width: '96vw', height: '70vh', backgroundColor:'#808080'}} >
            <div ref={pdfRef}>
                {
                    [...listOfPeople.keys()].map((key,index)=>{
                        //console.log(index, listOfPeople.get(key));
                        const person = listOfPeople.get(key);
                        let rowStyles = null;
                        if(index === 0){ // the very first row
                            rowStyles = Object.assign({}, rowPadding, rowFirst);
                        }else if(index % 3 === 0){  // the first row of every next pages
                            rowStyles = Object.assign({}, rowPadding, rowFirst, rowPagebreak);
                        }else{ // every other rows
                            rowStyles = Object.assign({}, rowPadding);
                        }

                        let name = [];
                        if(person.eng_name === ""){
                            name.push(<h1 style={{textAlign:'center', letterSpacing: '1px'}}><b>{person.kor_name}</b></h1>);
                        }else if(person.kor_name === ""){
                            name.push();
                        }else{
                            name.push(<h1 style={{lineHeight:'55px',textAlign:'center', letterSpacing: '1px'}}><b>{person.eng_name}</b></h1>);
                            name.push(<h1 style={{lineHeight:'55px',textAlign:'center', letterSpacing: '1px'}}><b>{person.kor_name}</b></h1>);
                        }
                    
                        return (
                            <Row key={index} style={rowStyles}>
                                <Col xs='auto' style={{paddingLeft:'0', paddingRight:'0'}}>
                                <Container style={person.group_name==="Pastor"?backgrounRed:backgroundBlue}>
                                    <h5 style={{marginTop: '20px', marginRight:'3px', textAlign: 'right', color: '#ffffff'}}>{person.church} CHURCH</h5>
                                    <Container style={lodgingImage}/>   
                                    <h6 style={{marginTop: '-42px', marginLeft:'40px', textAlign: 'left'}}><b>{person.kor_sleeping_area===""||person.kor_sleeping_area==="호텔"?"*":person.kor_sleeping_area}</b></h6>
                                    <h6 style={{marginTop: '-7px', marginLeft:'40px', textAlign: 'left'}}><b>{person.eng_sleeping_area===""||person.eng_sleeping_area==="Hotel"?"*":person.eng_sleeping_area}</b></h6>
                                    <Container style={{height: '110px'}}>
                                        <h1 style={{lineHeight:'55px',textAlign:'center', letterSpacing: '1px'}}><b>
                                            {person.eng_name === "" ? person.kor_name
                                            :person.kor_name === "" ? person.eng_name
                                            :person.eng_name}<br/>{person.kor_name}
                                        </b></h1>
                                    </Container>
                                    <Container style={{marginTop:'-33px', marginLeft:'-20px', textAlign:'left'}}>
                                        <QRCode value={person.barcode} size={50}/>
                                        {/* Replaced with QRCode<Barcode value={person.barcode} height={30} displayValue={false} width={1} /> */}
                                    </Container>
                                    <h6 style={{marginTop: '23px', marginLeft:'3px', textAlign: 'left', color: '#ffffff', letterSpacing: '-1px'}}>{person.event_name}</h6>
                                </Container>
                                </Col>
                                <Col style={{paddingLeft:'0', paddingRight:'0'}}>
                                <Container style={person.group_name==="Pastor"?backgrounRed:backgroundBlue}>
                                    <h5 style={{marginTop: '20px', marginRight:'3px', textAlign: 'right', color: '#ffffff'}}>{person.church} CHURCH</h5>
                                    <Container style={lodgingImage}/>   
                                    <h6 style={{marginTop: '-42px', marginLeft:'40px', textAlign: 'left'}}><b>{person.kor_sleeping_area===""||person.kor_sleeping_area==="호텔"?"*":person.kor_sleeping_area}</b></h6>
                                    <h6 style={{marginTop: '-7px', marginLeft:'40px', textAlign: 'left'}}><b>{person.eng_sleeping_area===""||person.eng_sleeping_area==="Hotel"?"*":person.eng_sleeping_area}</b></h6>
                                    <Container style={{height: '110px'}}>
                                    <h1 style={{lineHeight:'55px',textAlign:'center', letterSpacing: '1px'}}><b>
                                        {person.eng_name === "" ? person.kor_name
                                        :person.kor_name === "" ? person.eng_name
                                        :person.eng_name}<br/>{person.kor_name}
                                    </b></h1>
                                    </Container>
                                    <Container style={{marginTop:'-33px', marginRight:'-20px', textAlign:'right'}}>
                                        <QRCode value={person.barcode} size={50}/>
                                        {/* Replaced with QRCode<Barcode value={person.barcode} height={30} displayValue={false} width={1} /> */}
                                    </Container>
                                    <h6 style={{marginTop: '23px', marginLeft:'3px', textAlign: 'left', color: '#ffffff', letterSpacing: '-1px'}}>{person.event_name}</h6>
                                </Container>
                                </Col>
                            </Row>
                        )
                    })
                }
            </div>
        </Container>
      </div>
    </Container>
  );
}

export default PrintPage;