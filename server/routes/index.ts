import { Router } from "express";
import * as apiController from "../controllers/api.controller";

const router = Router();

router.get("/geocode", apiController.getGeocode);
router.get("/weather", apiController.getWeather);
router.post("/itinerary", apiController.getItinerary);
router.post("/analyze-weather-alerts", apiController.analyzeAlerts);
router.get("/redis/stats", apiController.getRedisStats);
router.post("/redis/clear", apiController.clearRedis);

export default router;
