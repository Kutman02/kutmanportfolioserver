import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { category, title, items, order } = req.body;
    
    const skill = new Skill({
      category,
      title,
      items: Array.isArray(items) ? items : [],
      order: order || 0
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { category, title, items, order } = req.body;
    
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        category,
        title,
        items: Array.isArray(items) ? items : [],
        order: order || 0
      },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

