import { createSlice } from "@reduxjs/toolkit";
// Load cart items from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
    }
};

// Save cart items to localStorage
const saveCartToLocalStorage = (cartItems) => {
    try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadCartFromLocalStorage(),
    },
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
            saveCartToLocalStorage(state.items);
          
        },
        removeItem: (state) => {
            state.items.pop(); // Assuming removing the last item as an example
            saveCartToLocalStorage(state.items); 
       
        },
        clearCart: (state) => {
            state.items.length = 0;
            localStorage.removeItem("cartItems");
        },
    },
});

export default cartSlice.reducer;
export const { addItem, removeItem, clearCart } = cartSlice.actions;
