const router = require('express').Router();
const ctrl = require('../controllers/airportController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require login; write routes require admin
router.use(protect);

router.get('/', ctrl.getAirports);
router.post('/', adminOnly, ctrl.createAirport);
router.patch('/:id', adminOnly, ctrl.updateAirport);
router.patch('/:id/toggle', adminOnly, ctrl.toggleAirport);

router.get('/:airportId/terminals', ctrl.getTerminals);
router.post('/:airportId/terminals', adminOnly, ctrl.createTerminal);
router.patch('/:airportId/terminals/:terminalId', adminOnly, ctrl.updateTerminal);
router.patch('/:airportId/terminals/:terminalId/toggle', adminOnly, ctrl.toggleTerminal);

module.exports = router;
