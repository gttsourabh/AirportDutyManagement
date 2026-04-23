const Airport = require('../models/Airport');
const Terminal = require('../models/Terminal');

// ── Airports ──────────────────────────────────────────────

exports.getAirports = async (req, res, next) => {
  try {
    const airports = await Airport.find().sort({ name: 1 });
    res.json(airports.map(a => a.toJSON()));
  } catch (err) { next(err); }
};

exports.createAirport = async (req, res, next) => {
  try {
    const { name, code, city } = req.body;
    if (!name || !code || !city)
      return res.status(400).json({ message: 'Name, code and city are required' });
    const airport = await Airport.create({ name, code, city });
    res.status(201).json(airport.toJSON());
  } catch (err) { next(err); }
};

exports.updateAirport = async (req, res, next) => {
  try {
    const { name, code, city } = req.body;
    const airport = await Airport.findByIdAndUpdate(
      req.params.id, { name, code, city }, { new: true, runValidators: true }
    );
    if (!airport) return res.status(404).json({ message: 'Airport not found' });
    res.json(airport.toJSON());
  } catch (err) { next(err); }
};

exports.toggleAirport = async (req, res, next) => {
  try {
    const airport = await Airport.findByIdAndUpdate(
      req.params.id, { isActive: req.body.isActive }, { new: true }
    );
    if (!airport) return res.status(404).json({ message: 'Airport not found' });
    res.json(airport.toJSON());
  } catch (err) { next(err); }
};
 
// ── Terminals ─────────────────────────────────────────────

exports.getTerminals = async (req, res, next) => {
  try {
    const { airportId } = req.params;
    const terminals = await Terminal.find({ airportId }).sort({ name: 1 });
    res.json(terminals.map(t => t.toJSON()));
  } catch (err) { next(err); }
};

exports.getAllTerminals = async (req, res, next) => {
  try {
    const terminals = await Terminal.find().sort({ airportId: 1, name: 1 });
    res.json(terminals.map(t => t.toJSON()));
  } catch (err) { next(err); }
};

exports.createTerminal = async (req, res, next) => {
  try {
    const { airportId } = req.params;
    const { name, code } = req.body;
    if (!name || !code)
      return res.status(400).json({ message: 'Name and code are required' });
    const airport = await Airport.findById(airportId);
    if (!airport) return res.status(404).json({ message: 'Airport not found' });
    const terminal = await Terminal.create({ airportId, name, code });
    res.status(201).json(terminal.toJSON());
  } catch (err) { next(err); }
};

exports.updateTerminal = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const terminal = await Terminal.findByIdAndUpdate(
      req.params.terminalId, { name, code }, { new: true, runValidators: true }
    );
    if (!terminal) return res.status(404).json({ message: 'Terminal not found' });
    res.json(terminal.toJSON());
  } catch (err) { next(err); }
};

exports.toggleTerminal = async (req, res, next) => {
  try {
    const terminal = await Terminal.findByIdAndUpdate(
      req.params.terminalId, { isActive: req.body.isActive }, { new: true }
    );
    if (!terminal) return res.status(404).json({ message: 'Terminal not found' });
    res.json(terminal.toJSON());
  } catch (err) { next(err); }
};
 


