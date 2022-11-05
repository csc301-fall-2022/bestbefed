import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faShoppingCart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import MenuSlideIn from "./MenuSlideIn";
import StoreList from "./StoreList";

function FloatingUI() {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenu = () => {
    setShowMenu(true);
  };
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <Container
      className="foreground position-absolute vh-100 p-3 pe-none d-flex"
      fluid
    >
      {/* Left side of screen */}
      <Col
        className="d-flex flex-column col-12 col-md-7 col-lg-6 col-xl-5 text-start bg-white p-4 rounded-4 pe-auto shadow"
        id="left-panel"
      >
        <Container
          className="d-flex p-0 justify-content-between pb-3"
          id="nearby-header"
        >
          <h2>Nearby</h2>
          <Button variant="outline-dark" className="rounded-5 px-4">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Container>
        <StoreList />
      </Col>
      {/* Right side of screen */}
      <Col className="d-none d-md-inline" id="map-visible-area">
        <Row className="g-0 justify-content-end mb-2">
          <Button
            variant="dark"
            size="lg"
            className="rounded-circle pe-auto shadow"
            onClick={handleShowMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </Row>
        <Row className="g-0 justify-content-end">
          <Button
            variant="dark"
            size="lg"
            className="rounded-circle pe-auto shadow"
            onClick={() => {
              /* TODO: Implement route change */
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </Button>
        </Row>
      </Col>
      {/* Slide-in menu */}
      <MenuSlideIn showMenu={showMenu} handleCloseMenu={handleCloseMenu} />
    </Container>
  );
}

export default FloatingUI;
