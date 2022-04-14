import React from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';

const buttonResponsiveStyle = {
  fontSize:'6vh',
  width: '100%',
  height:'100%'
}

const rowStyle = {
  height:'37vh'
}

function HomePage() {
  const navigate = useNavigate();
  return (
    <Container fluid className="d-grid gap-2">
      <div className="App">
        <h2 style={{fontSize: '8vh'}}>JBCH KY Retreat Registeration</h2>
      </div>
      <Container fluid className="d-grid gap-4">
        <Row style={rowStyle}>
          <Col>
            <Button style={buttonResponsiveStyle} variant="outline-primary" size="lg" onClick={() => navigate('/event')}>Event Management</Button>
          </Col>
          <Col>
            <Button style={buttonResponsiveStyle} variant="outline-primary" size="lg" onClick={() => navigate('/registration')}>Registration</Button>
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col>
            <Button style={buttonResponsiveStyle} variant="outline-primary" size="lg" onClick={() => navigate('/check-in')}>Check In</Button>
          </Col>
          <Col>
            <Button style={buttonResponsiveStyle} variant="outline-primary" size="lg" onClick={() => navigate('/report')}>Report</Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default HomePage;