import { Router } from "express";
import { getAllSpecialization } from "../../controllers/specialization.constroller";
const router = Router()
router.get("/get",getAllSpecialization)
const specializationRoute = router
export default specializationRoute