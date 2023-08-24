const express = require('express');
const app = express();
const PORT = process.env.PORT || 5050;

const kpiRoutes = require('./routes/kpi-routes');
const requestRoutes = require('./routes/request-routes')

app.use(express.json());

// all users routes
app.use('/kpis', kpiRoutes);

app.use('/requests',requestRoutes);




app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });
