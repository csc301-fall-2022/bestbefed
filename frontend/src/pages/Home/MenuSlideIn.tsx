import React from "react";
import { Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faList,
  faCog,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function MenuSlideIn({
  showMenu,
  handleCloseMenu,
}: {
  showMenu: boolean;
  handleCloseMenu: () => void;
}) {
  return (
    <Offcanvas show={showMenu} onHide={handleCloseMenu} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>
          <FontAwesomeIcon icon={faUser} size="lg" /> Profile
        </p>
        <p>
          <FontAwesomeIcon icon={faList} size="lg" /> Order History
        </p>
        <p>
          <FontAwesomeIcon icon={faCog} size="lg" /> Settings
        </p>
        <p>
          <FontAwesomeIcon icon={faRightFromBracket} size="lg" />{" "}
          <Link to="/logout" className="text-dark">
            Log out
          </Link>
        </p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MenuSlideIn;
