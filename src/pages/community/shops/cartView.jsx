import React, { useState } from 'react';
import { useGiraf } from '../../../giraf';

const CartView = () => {
    const {addGHead} = useGiraf();
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Product 1, with an extra name', price: 10, quantity: 1 },
        { id: 2, name: 'Product 2', price: 20, quantity: 2 },
    ]);

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
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className='cart_view' style={{ padding: '20px' }}>
            <p className='cv_hd'>Shopping Cart</p>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className='cart_item'
                        >
                            <div className='ci_left'>
                                <p className='ci_ih'>{item.name}</p>
                                <p className='ci_ip'>Price: ${item.price}</p>
                            </div>
                            <div className='ci_right'>
                                <label>
                                    Quantity:
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                        style={{ width: '50px', marginLeft: '10px' }}
                                        onFocus={()=>{
                                            addGHead("keyboard", true);
                                          }}
                                          onBlur={() => {
                                            setTimeout(() => {
                                              addGHead("keyboard", undefined);
                                            }, 100);
                                            console.log("onblure");
                                          }}
                                    />
                                </label>
                                <div
                                    onClick={() => handleRemoveItem(item.id)}
                                    className='cv_rmv_butt'
                                >
                                    Remove
                                </div>
                            </div>
                        </div>
                    ))}
                    <h2>Total: ${calculateTotal()}</h2>
                </div>
            )}
        </div>
    );
};

export default CartView;