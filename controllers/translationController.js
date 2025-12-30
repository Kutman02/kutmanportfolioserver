import Translation from '../models/Translation.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTranslations = async (req, res) => {
  try {
    const { language } = req.query;
    let query = {};
    if (language) {
      query.language = language;
    }
    const translations = await Translation.find(query).sort({ language: 1 });
    res.json({ translations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTranslation = async (req, res) => {
  try {
    const translation = await Translation.findOne({ language: req.params.language });
    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }
    res.json(translation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrUpdateTranslation = async (req, res) => {
  try {
    const { language, data } = req.body;

    if (!language || !data) {
      return res.status(400).json({ error: 'Language and data are required' });
    }

    if (!['en', 'ru'].includes(language)) {
      return res.status(400).json({ error: 'Language must be "en" or "ru"' });
    }

    const translation = await Translation.findOneAndUpdate(
      { language },
      { language, data },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(translation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const importFromFile = async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'ru'].includes(language)) {
      return res.status(400).json({ error: 'Language must be "en" or "ru"' });
    }

    const filePath = path.join(__dirname, `../../client/src/locales/${language}/translation.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: `Translation file not found at ${filePath}. Please ensure the file exists or create it first.` 
      });
    }

    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const translation = await Translation.findOneAndUpdate(
      { language },
      { language, data: fileData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ 
      message: 'Translation imported successfully',
      translation 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTranslation = async (req, res) => {
  try {
    const translation = await Translation.findOneAndDelete({ language: req.params.language });
    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }
    res.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
