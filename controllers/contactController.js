import Contact from '../models/Contact.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ order: 1 });
    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { platform, url, icon, order } = req.body;
    
    const contact = new Contact({
      platform,
      url,
      icon,
      order: order || 0
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { platform, url, icon, order } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        platform,
        url,
        icon,
        order: order || 0
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

