import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, image, images, youtubeVideo, github, demo, features } = req.body;
    
    // Валидация обязательных полей
    if (!title || !description || !image) {
      return res.status(400).json({ 
        error: 'Title, description, and image are required fields' 
      });
    }

    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
      image: image.trim(),
      images: Array.isArray(images) ? images.filter(img => img && img.trim()) : [],
      youtubeVideo: youtubeVideo?.trim() || '',
      github: github?.trim() || '',
      demo: demo?.trim() || '',
      features: Array.isArray(features) ? features : (features ? [features] : [])
    });

    await project.save();
    console.log(`Project created: ${project.title}`);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, technologies, image, images, youtubeVideo, github, demo, features } = req.body;
    
    // Валидация обязательных полей
    if (!title || !description || !image) {
      return res.status(400).json({ 
        error: 'Title, description, and image are required fields' 
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
        image: image.trim(),
        images: Array.isArray(images) ? images.filter(img => img && img.trim()) : [],
        youtubeVideo: youtubeVideo?.trim() || '',
        github: github?.trim() || '',
        demo: demo?.trim() || '',
        features: Array.isArray(features) ? features : (features ? [features] : [])
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`Project updated: ${project.title}`);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: error.message || 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

