import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";

function HeaderSearchBar({ setQuery }: { setQuery: (query: string) => void }) {
  let searchbar = useRef<HTMLInputElement | null>(null);
  let [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searching) {
      searchbar.current?.focus();
    }
  }, [searching]);

  if (searching) {
    return (
      <Container
        className="d-flex p-0 justify-content-between gap-2 align-items-center"
        id="search-header"
      >
        <FontAwesomeIcon icon={faSearch} />
        <div className="search-input flex-grow-1 mx-2 h-100">
          <input
            type="text"
            name="search"
            ref={searchbar}
            placeholder="Search for a store..."
            maxLength={255}
            autoComplete="off"
            className="py-0 ps-0 h-100 w-100"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          ></input>
          <span className="underline"></span>
        </div>
        <Button
          variant="outline-dark"
          className="rounded-5 px-4 my-0"
          onClick={() => {
            setSearching(false);
            setQuery("");
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Container>
    );
  } else {
    return (
      <Container
        className="d-flex p-0 justify-content-between align-items-center"
        id="nearby-header"
      >
        <h2 className="my-0">Nearby</h2>
        <Button
          variant="outline-dark"
          className="rounded-5 px-4 my-0"
          onClick={() => setSearching(true)}
        >
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </Container>
    );
  }
}

export default HeaderSearchBar;
