import React, { useState } from "react";
import { useGiraf } from "../../../giraf";
import { baseUrl, usePostApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import CButton from "../../../components/buttton";

const CartView = () => {
  const { gHead, addGHead } = useGiraf();
  const [cartItems, setCartItems] = useState(gHead.cart || []);
  const { actionRequest } = usePostApi();

  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const [orderSuccess, setOrderSuccesss] = useState(false)
  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
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

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    let remItems = cartItems.filter((item) => item.id !== id);
    addGHead("cart", remItems);
    localStorage.setItem("cart", JSON.stringify(remItems));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const pushOrder = () => {
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}shops/orders`,
      params: {
        order_items: cartItems,
      },
    })
      .then((res) => {
        console.log(res.data);
        pushMessage("Order Placed Successfully", "success");
        setCartItems([]);
        addGHead("cart", []);
        localStorage.setItem("cart", JSON.stringify([]));
        setOrderSuccesss(succ => true)

      })
      .catch((err) => {
        pushMessage(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="cart_view" style={{ padding: "16px", paddingBottom: 88 }}>
      {orderSuccess && (
        <div className="order_confirm">
          <div className="order_confirm_card">
            <p>
              We have received your order!
              You will receive an email of your invoice, delivery and payment details
            </p>
            <CButton
              text={"Close"}
              onClick={() => {
                addGHead("shop_view", "landing");
              }}
            />
          </div>
        </div>
      )}
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      <p className="cv_hd">Shopping Cart</p>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cv_grid">
          <div className="cv_list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart_item">
                <div className="ci_left">
                  <p className="ci_ih">{item.name}</p>
                  <p className="ci_ip">Price: ${item.price}</p>
                </div>
                <div className="ci_right">
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      style={{ width: "60px", marginLeft: "10px" }}
                      onFocus={() => {
                        addGHead("keyboard", true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          addGHead("keyboard", undefined);
                        }, 100);
                      }}
                    />
                  </label>
                  <div
                    onClick={() => handleRemoveItem(item.id)}
                    className="cv_rmv_butt"
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="cv_summary">
            <p className="cv_hd">Order Summary</p>
            <div className="cv_row">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="cv_row total">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="cv_summary_cta">
              <div className="check_out" onClick={pushOrder} aria-label="Proceed to checkout">
                Check Out
              </div>
            </div>
          </aside>
          {/* <h2 className="cv_total">Total: ${calculateTotal()}</h2> */}
          <div className="check_out_bar">
            <div className="check_out" onClick={pushOrder} aria-label="Proceed to checkout">
              Check Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
