import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reservationSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    selectedSeats: [{ type: String, required: true }],
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Reservation = model('Reservation', reservationSchema);

export default Reservation;
