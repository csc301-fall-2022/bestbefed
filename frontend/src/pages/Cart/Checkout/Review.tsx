import "./review.css"

interface CartItem {
    cart_item_id: number;
    name: string;
    store: string;
    quantity: number;
    price: number;
    inventory_item: number;
    imageUrl: string;
  }

interface ReviewProps {
    items: CartItem[],
    total: number
}



function Reveiw(props: ReviewProps){
    console.log(props.items)
    return (  
    <>
 
        <div className="rowtop">
            <div className="col">

                <h3 className="row">
                            ITEM
                </h3>

                {props.items.map((item) =>
                    <span key={item.cart_item_id} className="row">
                        {item.name}
                    </span>)
                }               
            </div>

            <div className="col">

                <h3 className="row">
                            PRICE
                </h3>

                {props.items.map((item) =>
                    <span key={item.cart_item_id} className="row">
                        {`$ ` + item.price}
                    </span>)
                }               
            </div>

            <div className="col">

                <h3 className="row">
                            QUANTITY
                </h3>
                {props.items.map((item) =>
                    <span key={item.cart_item_id} className="row">
                        {item.quantity}
                    </span>)
                }               
            </div>
        </div>

        <h3 style={{textAlign: "center", marginTop: "1em", color: "black"}}>
            Total with taxes: {` $` + (props.total * 1.13)}
        </h3>
    </> 
    )
}
export default Reveiw