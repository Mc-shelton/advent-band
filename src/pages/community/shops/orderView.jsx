import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { baseUrl, useGetApi } from "../../../../bff/hooks";

const OrderView = () => {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const { actionRequest } = useGetApi();

  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const pushMessage = (m, t) => {
    setMessageType(t);
    setMessage((k) => {
      let i = m;
      setTimeout(() => {
        setMessage((p) => null);
      }, 3000);
      return i;
    });
  };

  useEffect(() => {
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}shops/orders`,
      cacheKey: 'shop_orders',
      strategy: 'cache-first',
      cacheTtlMs: 2 * 60 * 1000, // orders change often; short TTL
      onUpdate: (res) => setCartItems(res.data)
    })
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        pushMessage(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="cart_view" style={{ padding: "20px" }}>
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      <p className="cv_hd">Your Orders</p>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((order) => {
            return (
              <div>
                <p style={{
                    fontSize: "12px",
                }}>Order : {order.order_id}</p>
                {order.OrderItems.map((item) => {
                  return (
                    <div key={item.id} className="cart_item">
                      <div className="ci_left">
                        <p className="ci_ih">{item.Item.name}</p>
                        <p className="ci_ip">Price: ${item.Item.price}</p>
                      </div>
                      <div className="ci_right">
                        <label>
                          Quantity:
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            style={{ width: "50px", marginLeft: "10px" }}
                            // onFocus={() => {
                            //   addGHead("keyboard", true);
                            // }}
                            // onBlur={() => {
                            //   setTimeout(() => {
                            //     addGHead("keyboard", undefined);
                            //   }, 100);
                            //   console.log("onblure");
                            // }}
                          />
                        </label>
                        {/* <div
                          onClick={() => handleRemoveItem(item.id)}
                          className="cv_rmv_butt"
                        >
                          Remove
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderView;
