import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";


const rentalSlice = createSlice({
    name:'rental',
    initialState:{
                cars:[],
                status: "idle",
                error: null,
                page: 1,
                totalPages: 1,
                pageSize: 10,
                totalCount: 0,
                selectedCar: null,
                selectedCarStatus: "idle",
                selectedCarError: null,
                bookingStatus: "idle",
                bookingError: null,
                bookingResult: null,
                paypalApprovalUrl: null,
    },
    reducers:{
                setCars: (state, action)=>{
                        state.cars = action.payload
                },
                fetchCarsStart: (state)=>{
                    state.status = "loading";
                    state.error = null;
                },
                fetchCarsSuccess: (state, action)=>{
                    const { cars, page, totalPages, totalCount } = action.payload || {};
                    state.status = "succeeded";
                    state.cars = cars || [];
                    if (page) state.page = page;
                    if (totalPages) state.totalPages = totalPages;
                    if (typeof totalCount === "number") state.totalCount = totalCount;
                },
                fetchCarsFailure: (state, action)=>{
                    state.status = "failed";
                    state.error = action.payload || "Unable to fetch cars";
                },
                fetchCarDetailStart: (state)=>{
                    state.selectedCarStatus = "loading";
                    state.selectedCarError = null;
                },
                fetchCarDetailSuccess: (state, action)=>{
                    state.selectedCarStatus = "succeeded";
                    state.selectedCar = action.payload;
                },
                fetchCarDetailFailure: (state, action)=>{
                    state.selectedCarStatus = "failed";
                    state.selectedCarError = action.payload || "Unable to fetch car details";
                },
                bookRentalStart: (state) => {
                    state.bookingStatus = "loading";
                    state.bookingError = null;
                    state.bookingResult = null;
                    state.paypalApprovalUrl = null;
                },
                bookRentalSuccess: (state, action) => {
                    state.bookingStatus = "succeeded";
                    state.bookingResult = action.payload;
                    state.paypalApprovalUrl = action.payload?.approval_url ?? null;
                },
                bookRentalFailure: (state, action) => {
                    state.bookingStatus = "failed";
                    state.bookingError = action.payload || "Booking failed";
                },
                resetBooking: (state) => {
                    state.bookingStatus = "idle";
                    state.bookingError = null;
                    state.bookingResult = null;
                    state.paypalApprovalUrl = null;
                },
        }
})

export const {
    setCars,
    fetchCarsStart, fetchCarsSuccess, fetchCarsFailure,
    fetchCarDetailStart, fetchCarDetailSuccess, fetchCarDetailFailure,
    bookRentalStart, bookRentalSuccess, bookRentalFailure, resetBooking,
} = rentalSlice.actions

// Plain thunk (no createAsyncThunk) to load cars
export const fetchCars = (page = 1) => async (dispatch, getState) => {
    try {
        dispatch(fetchCarsStart());
        const { pageSize } = getState().rental;
        const response = await axiosInstance.get(`/cars/?page=${page}`);
        const data = response.data;
        const cars = Array.isArray(data?.results) ? data.results : data;
        const totalCount = typeof data?.count === "number" ? data.count : (Array.isArray(cars) ? cars.length : 0);
        const totalPages = Math.max(1, Math.ceil(totalCount / (pageSize || 10)));
        dispatch(fetchCarsSuccess({ cars, page, totalPages, totalCount }));
    } catch (error) {
        const message = error.response?.data || error.message || "Failed to load cars";
        dispatch(fetchCarsFailure(message));
    }
};

const extractError = (error) => {
    const data = error.response?.data;
    if (!data) return error.message || "Something went wrong.";
    if (typeof data === "string") return data;
    if (data.non_field_errors) return data.non_field_errors.join(" ");
    return Object.values(data).flat().join(" ");
};

export const bookAndPay = ({ car_id, start_date, end_date, payment_method }) => async (dispatch) => {
    try {
        dispatch(bookRentalStart());
        // Step 1: create rental
        const rentalRes = await axiosInstance.post("/rental/", { car_id, start_date, end_date });
        const rental = rentalRes.data;
        // Step 2: create payment for that rental
        const paymentRes = await axiosInstance.post("/payment/", {
            rental_id: rental.id,
            payment_method,
        });
        const paymentData = paymentRes.data;

        if (payment_method === "paypal" && paymentData.approval_url) {
            // Store the URL in state, then component will redirect
            dispatch(bookRentalSuccess({
                rental,
                payment: paymentData,
                approval_url: paymentData.approval_url,
            }));
        } else {
            // Cash: backend already set rental active
            dispatch(bookRentalSuccess({ rental: { ...rental, status: "active" }, payment: paymentData }));
        }
    } catch (error) {
        dispatch(bookRentalFailure(extractError(error)));
    }
};

export const executePaypalPayment = ({ paypal_payment_id, payer_id }) => async (dispatch) => {
    try {
        dispatch(bookRentalStart());
        const res = await axiosInstance.post("/payment/execute/", { paypal_payment_id, payer_id });
        dispatch(bookRentalSuccess({ detail: res.data.detail }));
    } catch (error) {
        dispatch(bookRentalFailure(extractError(error)));
    }
};

export const fetchCarDetail = (slug) => async (dispatch) => {
    try {
        dispatch(fetchCarDetailStart());
        const response = await axiosInstance.get(`/car-detail/${slug}/`);
        dispatch(fetchCarDetailSuccess(response.data));
    } catch (error) {
        const message = error.response?.data || error.message || "Failed to load car details";
        dispatch(fetchCarDetailFailure(message));
    }
};

export default rentalSlice.reducer