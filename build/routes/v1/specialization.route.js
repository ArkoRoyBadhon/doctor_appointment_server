"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specialization_constroller_1 = require("../../controllers/specialization.constroller");
const router = (0, express_1.Router)();
router.get("/get", specialization_constroller_1.getAllSpecialization);
const specializationRoute = router;
exports.default = specializationRoute;
