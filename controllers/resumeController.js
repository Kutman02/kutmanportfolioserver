import Resume from '../models/Resume.js';

export const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne();
    
    // Если резюме нет, создаем пустое
    if (!resume) {
      resume = await Resume.create({});
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { file, fileUrl, externalLink } = req.body;
    
    let resume = await Resume.findOne();
    
    if (!resume) {
      resume = await Resume.create({
        file: file || '',
        fileUrl: fileUrl || '',
        externalLink: externalLink || ''
      });
    } else {
      resume.file = file || resume.file;
      resume.fileUrl = fileUrl || resume.fileUrl;
      resume.externalLink = externalLink || resume.externalLink;
      await resume.save();
    }
    
    console.log(`Resume updated`);
    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(400).json({ error: error.message || 'Failed to update resume' });
  }
};

