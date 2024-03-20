import Bus from "../model/bus.models.js";
import Reservation from "../model/reservation.model.js";
import { transporter } from "../Mail/mailTransport.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const addBus = async (req, res) => {
  try {
    const {
      busNumber,
      departureCity,
      destinationCity,
      departureTime,
      arrivalTime,
      duration,
      busType,
      capacity,
      pricePerSeat
    } = req.body;
    const newBus = new Bus({
      busNumber,
      departureCity,
      destinationCity,
      departureTime,
      arrivalTime,
      duration,
      busType,
      capacity,
      pricePerSeat
    });
    await newBus.save();
    res.status(201).json({ message: 'New bus added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new bus' });
  }
};

export const display_buses = async (req, res) => {
  try {
    const allBuses = await Bus.find();
    res.status(200).json(allBuses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

export const filter_bus = async (req, res) => {
  try {
    const { from, to } = req.body;
    const filteredBuses = await Bus.find({ departureCity: from, destinationCity: to });
    res.status(200).json(filteredBuses);
  }
  catch (error) {
    console.error('Error filtering buses:', error);
    res.status(500).json({ error: 'Failed to filter buses' });
  }
};


export const payment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};


export const reserve = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (error) {
    console.error('Error creating reservation:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editBus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      busNumber,
      departureCity,
      destinationCity,
      departureTime,
      arrivalTime,
      duration,
      busType,
      capacity,
      pricePerSeat
    } = req.body;

    const existingBus = await Bus.findById(id);
    if (!existingBus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    existingBus.set({
      busNumber,
      departureCity,
      destinationCity,
      departureTime,
      arrivalTime,
      duration,
      busType,
      capacity,
      pricePerSeat
    });

    await existingBus.save();

    res.status(200).json({ message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Failed to update bus' });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    await Bus.findByIdAndDelete(id);
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bus' });
  }
};

export const display_bus_by_id = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.status(200).json(bus);
  } catch (error) {
    console.error('Error fetching bus detail by ID:', error);
    res.status(500).json({ error: 'Failed to fetch bus detail by ID' });
  }
};



export const reserveSeat = async (req, res) => {
  try {
    const { name, email, phone, selectedSeats, busDetails, totalPrice } = req.body;
    const busId = busDetails._id;
    const reservation = new Reservation({
      name,
      email,
      phone,
      selectedSeats,
      bus: busId,
      totalPrice,
    });
    await reservation.save();  //reservation saved

   
    const pdfDoc = new PDFDocument();  //create pdf
    const pdfPath = `ticket_${reservation._id}.pdf`;
    pdfDoc.pipe(fs.createWriteStream(pdfPath));
    pdfDoc.fontSize(20).text('Ticket Reservation', { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(12).text(`Name: ${name}`);
    pdfDoc.fontSize(12).text(`Email: ${email}`);
    pdfDoc.fontSize(12).text(`Phone: ${phone}`);
    pdfDoc.fontSize(12).text(`Selected Seats: ${selectedSeats.join(', ')}`);
    pdfDoc.moveDown();
    pdfDoc.fontSize(12).text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    pdfDoc.fontSize(12).text('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    pdfDoc.fontSize(12).text('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
    pdfDoc.moveDown();
    pdfDoc.end();

    await transporter.sendMail({  // send pdf
      from: '0mrboss24o7@gmail.com',
      to: email,
      subject: 'Reservation Confirmation',
      text: 'Your reservation has been confirmed. Thank you!',
      attachments: [
        {
          filename: 'ticket.pdf',
          path: pdfPath,
        },
      ],
    });

    fs.unlinkSync(pdfPath);// delete pdf

    res.status(201).json({ success: true, message: 'Reservation created successfully' });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Failed to create reservation' });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
  }
};



export const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    await Reservation.findByIdAndDelete(reservationId);
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bus' });
  }
};
