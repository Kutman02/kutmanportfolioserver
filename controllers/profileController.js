import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Создаем дефолтный профиль
      profile = new Profile({
        profilePhoto: 'https://keephere.ru/get/HNAULXgZxfX/o/photo.jpg',
        profilePhotoAlt: 'Profile photo'
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePhoto, profilePhotoAlt } = req.body;
    
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = new Profile({
        profilePhoto: profilePhoto || 'https://keephere.ru/get/HNAULXgZxfX/o/photo.jpg',
        profilePhotoAlt: profilePhotoAlt || 'Profile photo'
      });
    } else {
      profile.profilePhoto = profilePhoto || profile.profilePhoto;
      profile.profilePhotoAlt = profilePhotoAlt || profile.profilePhotoAlt;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

