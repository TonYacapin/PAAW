const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const rabiesVaccinationReportRoutes = require('./routes/rabiesVaccinationReport.routes');
const diseaseinvestigationRoutes = require('./routes/diseaseInvestigationRoutes');
const vaccinationReportRoutes = require('./routes/vaccinationReportRoutes');
const RoutineServicesMonitoringReport = require('./routes/routineServicesMonitoringReportRoutes');
const RabiesHistoryRoutes = require('./routes/RabiesHistoryRoutes');
const TargetRoutes = require('./routes/Admin/targetRoutes');
const MunicipalityTargetRoutes = require('./routes/Admin/municipalityTargetRoutes');
const upgradingServicesRoutes = require('./routes/upgradingServices');
const offspringMonitoringRoutes = require('./routes/offspringmonitoring');
const technicianQuarterlyReportRoutes = require('./routes/technicianQuarterlyReport');
const slaughterformRoutes = require('./routes/slaughterformroutes');
const vetshipformroutes = require('./routes/vetshipformroutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const user = require('./routes/userRoutes');
const auth = require('./routes/loginRoute');
const animalhealthcareservicesRoutes = require('./routes/Client/animalhealthcareservicesRoutes');
const animalProductionServicesRoutes = require('./routes/Client/animalproductionservicesRoutes'); 
const veterinaryInformationServiceRoutes = require("./routes/Client/veterinaryinformationserviceRoutes");
const regulatoryCareServiceRoutes = require('./routes/Client/regulatorycareserviceRoutes');
const requisitionIssuanceRoutes = require('./routes/requisitionIssuanceRoutes');
const auditLogInventoryRoutes = require('./routes/auditLogInventoryRoutes'); 

const backupRestoreRoutes = require('./routes/backupRestore.routes');

// Import the audit log middleware
const auditLogMiddleware = require('./middleware/auditlogMiddleware');
const authMiddleware = require('./middleware/authMiddleware'); // Import your auth middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/PAAW', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json({ limit: '150mb' })); // Adjust the limit as needed
app.use(cors()); 

app.use('/', auth);
app.use('/api', user);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use authMiddleware to authenticate users
app.use(authMiddleware); // Ensure this is before the audit log middleware

// Use audit log middleware
app.use(auditLogMiddleware);

// Use routes
app.use('/api/backup-restore', backupRestoreRoutes);
app.use('/api/vetshipform', vetshipformroutes);
app.use('/api/slaughterform', slaughterformRoutes);
app.use('/api/technician-quarterly', technicianQuarterlyReportRoutes);
app.use('/api/offspring-monitoring', offspringMonitoringRoutes);
app.use('/api/upgrading-services', upgradingServicesRoutes);
app.use('/api/mtargets', MunicipalityTargetRoutes);
app.use('/api/targets', TargetRoutes);
app.use('/', diseaseinvestigationRoutes);
app.use('/', rabiesVaccinationReportRoutes);
app.use('/', vaccinationReportRoutes);
app.use('/', RoutineServicesMonitoringReport);
app.use('/', RabiesHistoryRoutes);
app.use('/api/animal-health-care-services', animalhealthcareservicesRoutes);
app.use('/api/animal-production-services', animalProductionServicesRoutes);
app.use("/api/veterinary-information-service", veterinaryInformationServiceRoutes);
app.use('/api/regulatory-services', regulatoryCareServiceRoutes);
app.use('/api/requisitions', requisitionIssuanceRoutes);
app.use('/api', auditLogRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/audit-logs-inventory', auditLogInventoryRoutes);

// Start server and set timeout
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.timeout = 0; // Disable timeout
