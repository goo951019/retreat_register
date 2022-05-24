import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

//Button functions 
async function addParticipants(event){
  let values = [];
  let kor_sleeping_area = "";

  for(let i = 2; i < event.target.length; i++){
    if(event.target[i].type !== "checkbox"){
      // needs this to split sleeping-area to korean and english
      if(event.target[i].id === "sleeping-area"){
        const splitted = event.target[i].value.split(':');
        kor_sleeping_area = splitted[0];
        values.push(splitted[1]);
        continue;  
      }
      values.push(event.target[i].value);
    }else{
      values.push(event.target[i].checked === false ? "N" : "Y");
    }
  }

  await window.api.addParticipant({
    kor_name : values[0], eng_name : values[1], church : values[2], group_name : values[3], is_guest : values[4],
    kor_sleeping_area : kor_sleeping_area, eng_sleeping_area : values[5], gender: values[6], fee : values[4] === "Y" ? 0 : values[7],
    speak_korean : values[8], speak_english : values[9], speak_spanish: values[10], speak_chinese: values[11],
    is_checked_in : values[12], is_fee_paid: values[13], remark: values[14]
  }).then(() => { 
    smalltalk.alert('Success', '"'+ values[0] === "" ? values[1] : values[0] +'" is Created!');
  })
}

// Register New Page
function RegisterNewPage() {
  const navigate = useNavigate();
  const [churchList, setChurchList] = useState(null);
  const [sleepingAreaList, setSleepingAreaList] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if(churchList == null) window.api.requestVisibleChurch();
    if(sleepingAreaList == null) window.api.requestVisibleSleeping_Area();
    window.api.getVisibleChurch(data => {if(isMounted){setChurchList(data); } });
    window.api.getVisibleSleeping_Area(data => {if(isMounted){setSleepingAreaList(data); } });
    return () => {isMounted = false;};
  });

  // For Guest, disable Fee input box
  const onGuestChange = (event) =>{
    if (event.target.value === "Y") setIsGuest(true);
    else setIsGuest(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let i = 2;
    // When both kor and eng name inputs are empty
    if(event.target[i].value === "" && event.target[i+1].value === ""){
      smalltalk.alert('Info','Enter name!');
      return;
    }
    addParticipants(event).then(()=>{
      navigate(-1);
    });
  }


  return (
    <Container fluid className="d-grid gap-2">
      <Form id="register-form" onSubmit={handleSubmit}>
        <div className="App">
          <h1 style={{fontSize: '8vh'}}>Registration Form</h1>
          <Container fluid className="w-100 p-0">
            <Button style={{fontSize: '3vh'}} className="m-3" variant="outline-danger" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" style={{fontSize: '3vh'}} className="m-3" variant="outline-primary" size="lg">Save</Button>
          </Container>
        </div>
        <div style={{width: '96vw', height: '70vh', fontSize: '3vh'}} >
          <Row className="m-2">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name (Korean)</Form.Label>
                <Form.Control className="kor-name" style={{fontSize: '3vh'}} type="text" placeholder="Enter Korean Name" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name (English)</Form.Label>
                <Form.Control style={{fontSize: '3vh'}} type="text" placeholder="Enter English Name" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Church</Form.Label>
                <Row>
                  <Col>
                    <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}}>
                      <option value="">Select</option>
                      { churchList !== null ? churchList.map((c) =>{
                        return (<option key={c.c_id} value={c.church_name}>{c.church_name}</option>)
                      }) : "loading" }
                    </Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Group</Form.Label>
                <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}}>
                  <option value="">Select</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Senior">Senior</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Young Adult">Young Adult</option>
                  <option value="Youth Group">Youth Group</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Kindergarden">Kindergarden</option>
                  <option value="Baby">Baby</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Guest?</Form.Label>
                <Form.Select aria-label="select" style={{fontSize: '3vh'}} onChange={onGuestChange}>
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="m-2">   
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Sleeping Area</Form.Label>
                <Row>
                  <Col>
                    <Form.Control id="sleeping-area" required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}}>
                      <option value="">Select</option>
                      { sleepingAreaList !== null ? sleepingAreaList.map((sa) =>{
                        return (<option key={sa.s_id} value={sa.kor_sleeping_area+":"+sa.eng_sleeping_area}>{sa.eng_sleeping_area}</option>)
                      }) : "loading" }
                    </Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}}>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Fee ($)</Form.Label>
                <Form.Control required={true} type="text" placeholder="$0.00" style={{fontSize: '3vh'}}  disabled={isGuest}/>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Label>Language(s) : </Form.Label>
            </Col>
            <Col>
              <Form.Check label="Korean" />
            </Col>
            <Col>
              <Form.Check label="English" />
            </Col>
            <Col>
              <Form.Check label="Spanish" />
            </Col>
            <Col>
              <Form.Check label="Chinese" />
            </Col>
          </Row>
          <Row className="m-2">
            <Col xs="3">
              <Form.Check label="Checking In?" />
              <Form.Check label="Fee Paid?" disabled={isGuest} />
            </Col>
            <Col xs="9">
              <Form.Group>
                <Form.Label>Remark</Form.Label>
                <Form.Control style={{fontSize: '3vh'}} type="text" placeholder="Enter any remarks" />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
    </Container>
  );
}

export default RegisterNewPage;