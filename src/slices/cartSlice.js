import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

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
            const courseId = action.payload._id;
            const existingItem = state.items.find(item => item._id === courseId);
            
            if (!existingItem) {
                state.items.push(action.payload);
                saveCartToLocalStorage(state.items);
                toast.success("Course added to cart!");
            } else {
                toast.error("Course already in cart!");
            }
        },
        removeItem: (state, action) => {
            const courseId = action.payload;
            state.items = state.items.filter(item => item._id !== courseId);
            saveCartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cartItems");
        },
        updateQuantity: (state, action) => {
            const { courseId, quantity } = action.payload;
            const item = state.items.find(item => item._id === courseId);
            if (item) {
                item.quantity = quantity;
                saveCartToLocalStorage(state.items);
            }
        },
    },
});

export default cartSlice.reducer;
export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;
