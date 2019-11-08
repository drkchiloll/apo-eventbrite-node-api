import * as express from 'express';

export const router: express.Router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

router.get('/', (req, res) =>
  res.json({
    name: "EventBrite Microservice"
  })
);