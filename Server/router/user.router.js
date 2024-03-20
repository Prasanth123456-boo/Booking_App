import express from "express";
import { register ,login ,verifyToken,refresh_token} from "../controller/auth.Controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { 
    addBus,
    display_buses,
    filter_bus,
    reserve,
    editBus,
    deleteBus,
    display_bus_by_id,
    reserveSeat,
    getAllReservations,
    deleteReservation
    
} from "../controller/bus.Controller.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/verify_token",authenticate,verifyToken);
router.post("/bus/add",authenticate,addBus)
router.get("/bus/display-all-bus",display_buses)
router.post("/bus/filter-bus",filter_bus)
router.post("/bus/reservation",reserve)
router.put("/bus/edit/:id",editBus)
router.delete("/bus/delete/:id",deleteBus)
router.post('/refresh-token',refresh_token)
router.get('/bus_single_detail/:id',display_bus_by_id)
router.post('/api/reserve-seat', reserveSeat)
router.get('/bus/display-all-reservations',authenticate,getAllReservations)
router.delete('/reservation/remove/:reservationId',deleteReservation)

export default router;
