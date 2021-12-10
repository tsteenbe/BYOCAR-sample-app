// SPDX-License-Identifier: MIT

import { Router } from 'express';
import VehicleController from "../controllers/vehicleController";

const router = Router();

const vehicleController = new VehicleController();

router.get('/vehicle/:vehicleId', vehicleController.getDashboardData);

export default router;
