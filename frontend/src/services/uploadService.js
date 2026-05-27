import axios from '@/lib/axios';

export const uploadAvatar = async (file) => {
  const form = new FormData();
  form.append('avatar', file);
  const res = await axios.post('/upload/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.avatar_url;
};
