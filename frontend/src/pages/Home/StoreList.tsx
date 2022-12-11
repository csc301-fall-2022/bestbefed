import React, { useEffect, useContext } from "react";
import StoreListItem from "./StoreListItem";
import { Container } from "react-bootstrap";
import { IMapContext, MapContext } from "./MapContextProvider";
export interface Store {
  id: string;
  name: string;
  category: string | null;
  distance: number | null;
  description: string;
}

function StoreList({ query }: { query: string }) {
  const { stores, getStores } = useContext(
    MapContext as React.Context<IMapContext>
  );

  useEffect(() => {
    getStores();
  }, [query]);

  return (
    <>
      {stores.features.length === 0 ? (
        <Container className="d-flex flex-grow-1 store-list px-0 align-items-center justify-content-center">
          <div className="fs-5 fst-italic text-secondary">No stores found</div>
        </Container>
      ) : (
        <Container className="flex-grow-1 store-list px-0 mt-3 pe-2">
          {stores.features.map((store) => {
            return <StoreListItem store={store} key={store.properties!.id} />;
          })}
        </Container>
      )}
    </>
  );
}

export default StoreList;
