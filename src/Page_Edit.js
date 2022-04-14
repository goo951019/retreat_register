import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import smalltalk from 'smalltalk';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

//Button functions 
async function updateParticipants(event, p_id){
  let values = [];
  let kor_sleeping_area = "";

  for(let i = 2; i < event.target.length; i++){
    if(event.target[i].type != "checkbox"){
      // needs this to split sleeping-area to korean and english
      if(event.target[i].id === "sleeping-area" && event.target[i].value !== "Other"){
        const splitted = event.target[i].value.split(':');
        kor_sleeping_area = splitted[0];
        values.push(splitted[1]);
        continue;  
      }
      //when it is others, target[i] gets pushed one time 
      if(event.target[i].value === "Other") i++;
      values.push(event.target[i].value);
    }else{
      values.push(event.target[i].checked == false ? "N" : "Y");
    }
  }

  await window.api.updateParticipant({
    kor_name : values[0], eng_name : values[1], church : values[2], group_name : values[3], is_guest : values[4],
    kor_sleeping_area : kor_sleeping_area, eng_sleeping_area : values[5], gender: values[6], fee : values[4] === "Y" ? 0 : values[7],
    speak_korean : values[8], speak_english : values[9], speak_spanish: values[10], speak_chinese: values[11],
    is_checked_in : values[12], is_fee_paid: values[13], remark: values[14], p_id: p_id
  }).then(() => { 
    smalltalk.alert('Success', '\"'+ values[0] === "" ? values[1] : values[0] +'\" is Updated!');
  })
}

// EditPage
function EditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const person = location.state;

  const churchName = 
    person.church !== "ATLANTA" && person.church !=="CHICAGO" && person.church!=="KENTUCKY" &&
    person.church !== "MICHIGAN" && person.church !=="NEW JERSEY" && person.church!=="NEW YORK" &&
    person.church !== "S. ILLINOIS" && person.church !=="S. VIRGINIA" && person.church!=="WASHINGTON" 
    ? "Other" : person.church;
  
  const mergeSleeping = person.kor_sleeping_area+":"+person.eng_sleeping_area;
  const sleepingArea = 
    mergeSleeping !== "호텔:Hotel" && mergeSleeping !== "텐트:Tent" && mergeSleeping !== "차량:Car" && mergeSleeping !== "베데스다:Bethesda" &&
    mergeSleeping !== "소망관 1층:Hope Hall 1st" && mergeSleeping !== "소망관 2층:Hope Hall 2nd" && mergeSleeping !== "유아방:Nursery Room" &&
    mergeSleeping !== "디모데관:Timothy Hall" && mergeSleeping !== "요셉관:Joseph Hall" && mergeSleeping !== "사무엘관 1층:Samuel Hall 1st" &&
    mergeSleeping !== "사무엘관 2층:Samuel Hall 2nd" && mergeSleeping !== "엘리야관:Elijah Hall" && mergeSleeping !== "엘리사관:Elisha Hall" &&
    mergeSleeping !== "사랑관:Charity Hall" && mergeSleeping !== "은혜관:Grace Hall" && mergeSleeping !== "빌라델비아관:Philadelpia Hall" &&
    mergeSleeping !== "아틀란타 캐빈:ATL Cabin" && mergeSleeping !== "시카고 모빌홈:Chicago Mobile Home" && mergeSleeping !== "뉴저지 캐빈:NJ Cabin" &&
    mergeSleeping !== "뉴저지 캐빈:NJ Cabin" && mergeSleeping !== "워싱턴 캐빈:Washington Cabin" && mergeSleeping !== "워싱턴 모빌홈:Washington Mobile Home" &&
    mergeSleeping !== "주방:Kitchen" && mergeSleeping !== "캐빈 1:Cabin 1" && mergeSleeping !== "캐빈 2:Cabin 2" &&
    mergeSleeping !== "캐빈 3:Cabin 3" && mergeSleeping !== "캐빈 4:Cabin 4" && mergeSleeping !== "캐빈 5:Cabin 5" &&
    mergeSleeping !== "캐빈 6:Cabin 6" ? "Other" : mergeSleeping;

  const [isGuest, setIsGuest] = useState(person.is_guest==="Y"?true:false);
  const [churchInput, setChurchInput] = useState(churchName==="Other"?true : false);
  const [sleepingInput, setSleepingInput] = useState(sleepingArea==="Other"?true : false);

  // For Guest, disable Fee input box
  const onGuestChange = (event) =>{
    if (event.target.value === "Y") setIsGuest(true);
    else setIsGuest(false);
  }

  // For "Other" Church
  const onChurchChange = (event) =>{
    if (event.target.value === "Other") setChurchInput(true);
    else setChurchInput(false);
  }

  // For "Other" Sleeping Area
  const onSleepingChange = (event) =>{
    if (event.target.value === "Other") setSleepingInput(true);
    else setSleepingInput(false);
  }

  useEffect(() => {
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault()
    let i = 2;
    // When both kor and eng name inputs are empty
    if(event.target[i].value === "" && event.target[i+1].value === ""){
      smalltalk.alert('Info','Enter name!');
      return;
    }
    updateParticipants(event, person.p_id).then(()=>{
      navigate(-1);
    });
  }


  return (
    <Container fluid className="d-grid gap-2">
      <Form id="register-form" onSubmit={handleSubmit}>
        <div className="App">
          <h1 style={{fontSize: '8vh'}}>Registration Edit</h1>
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
                <Form.Control className="kor-name" style={{fontSize: '3vh'}} type="text" placeholder="Enter Korean Name" defaultValue={person.kor_name}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name (English)</Form.Label>
                <Form.Control style={{fontSize: '3vh'}} type="text" placeholder="Enter English Name" defaultValue={person.eng_name}/>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Church</Form.Label>
                <Row>
                  <Col>
                    <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}} onChange={onChurchChange} defaultValue={churchName}>
                      <option value="">Select</option>
                      <option value="ATLANTA">Atlanta</option>
                      <option value="CHICAGO">Chicago</option>
                      <option value="KENTUCKY">Kentucky</option>
                      <option value="MICHIGAN">Michigan</option>
                      <option value="NEW JERSEY">New Jersey</option>
                      <option value="NEW YORK">New York</option>
                      <option value="S. ILLINOIS">S. Illinois</option>
                      <option value="S. VIRGINIA">S. Virginia</option>
                      <option value="WASHINGTON">Washington</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                  </Col>
                {churchInput ? <Col xs="8"><Form.Control required={true} style={{fontSize: '3vh'}} type="text" placeholder="Enter Church Name" defaultValue={churchName==="Other"? person.church : ""}/></Col> : null}
                </Row>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Group</Form.Label>
                <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}} defaultValue={person.group_name}>
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
                <Form.Select aria-label="select" style={{fontSize: '3vh'}} onChange={onGuestChange} defaultValue={person.is_guest}>
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
                    <Form.Control id="sleeping-area" required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}} onChange={onSleepingChange} defaultValue={sleepingArea}>
                      <option value="">Select</option>
                      <option value="호텔:Hotel">Hotel</option>
                      <option value="텐트:Tent">Tent</option>
                      <option value="차량:Car">Car</option>
                      <option value="베데스다:Bethesda">Bethesda</option>
                      <option value="소망관 1층:Hope Hall 1st">Hope Hall (1st Floor) - Sisters</option>
                      <option value="소망관 2층:Hope Hall 2nd">Hope Hall (2nd Floor) - Elders</option>
                      <option value="소망관 유아실:Hope Hall (Infant Room)">Hope Hall (Infant Room) - Siters w/ Baby</option>
                      <option value="디모데관:Timothy Hall">Timothy Hall - YA Brothers</option>
                      <option value="요셉관:Joseph Hall">Joseph Hall - Youth Group</option>
                      <option value="사무엘관 1층:Samuel Hall 1st">Samuel Hall (1st Floor) - Fathers</option>
                      <option value="사무엘관 2층:Samuel Hall 2nd">Samuel Hall (2nd Floor) - Pastors</option>
                      <option value="엘리야관:Elijah Hall">Elijah Hall - Pastors</option>
                      <option value="엘리사관:Elisha Hall">Elisha Hall - Patrol Volunteers</option>
                      <option value="사랑관:Charity Hall">Charity Hall - Snack Bar Volunteers</option>
                      <option value="은혜관:Grace Hall">Grace Hall - Spanish Ministry</option>
                      <option value="빌라델비아관:Philadelpia Hall">Philadelpia Hall - Michigan Mothers</option>
                      <option value="아틀란타 캐빈:ATL Cabin">ATL Cabin - ATL Mothers</option>
                      <option value="시카고 모빌홈:Chicago Mobile Home">Chicago Mobile Home - Chicago Mothers</option>
                      <option value="뉴저지 캐빈:NJ Cabin">NJ Cabin - NJ Mothers</option>
                      <option value="워싱턴 캐빈:Washington Cabin">Washington Cabin - Washington Fathers</option>
                      <option value="워싱턴 모빌홈:Washington Mobile Home">Washington Mobile Home - Washington Mothers</option>
                      <option value="주방:Kitchen">Kitchen - Mothers Head Officers</option>
                      <option value="캐빈 1:Cabin 1">Cabin 1</option>
                      <option value="캐빈 2:Cabin 2">Cabin 2</option>
                      <option value="캐빈 3:Cabin 3">Cabin 3</option>
                      <option value="캐빈 4:Cabin 4">Cabin 4</option>
                      <option value="캐빈 5:Cabin 5">Cabin 5</option>
                      <option value="캐빈 6:Cabin 6">Cabin 6</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                  </Col>
                  {sleepingInput ? <Col xs="8"><Form.Control required={true} style={{fontSize: '3vh'}} type="text" placeholder="Enter Sleeping Area" defaultValue={sleepingArea==="Other"?person.eng_sleeping_area:""}/></Col> : null}
                </Row>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Control required={true} custom="true" as="select" type="select" style={{fontSize: '3vh'}} defaultValue={person.gender}>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Fee ($)</Form.Label>
                <Form.Control required={true} type="text" placeholder="$0.00" style={{fontSize: '3vh'}}  disabled={isGuest} defaultValue={person.fee}/>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Label>Language(s) : </Form.Label>
            </Col>
            <Col>
              <Form.Check label="Korean" defaultChecked={person.speak_korean === "Y" ? true : false}/>
            </Col>
            <Col>
              <Form.Check label="English" defaultChecked={person.speak_english === "Y" ? true : false}/>
            </Col>
            <Col>
              <Form.Check label="Spanish" defaultChecked={person.speak_spanish === "Y" ? true : false}/>
            </Col>
            <Col>
              <Form.Check label="Chinese" defaultChecked={person.speak_chinese === "Y" ? true : false}/>
            </Col>
          </Row>
          <Row className="m-2">
            <Col xs="3">
              <Form.Check label="Checked In?" defaultChecked={person.is_checked_in === "Y" ? true : false}/>
              <Form.Check label="Fee Paid?" disabled={isGuest} defaultChecked={person.is_fee_paid === "Y" ? true : false} />
            </Col>
            <Col xs="9">
              <Form.Group>
                <Form.Label>Remark</Form.Label>
                <Form.Control style={{fontSize: '3vh'}} type="text" placeholder="Enter any remarks" defaultValue={person.remark}/>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
    </Container>
  );
}

export default EditPage;