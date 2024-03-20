import mongoose from 'mongoose';

const { Schema, model } = mongoose; 

const busSchema = new Schema({
    busNumber: String,
    departureCity: String,
    destinationCity: String,
    departureTime: Date,
    arrivalTime: Date,
    duration: String,
    busType: String,
    capacity: Number,
    pricePerSeat: Number,
    bookedSeats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });


const Bus = model('Bus', busSchema);

export default Bus;
