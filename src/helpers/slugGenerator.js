import slugify from 'slug';
import uuid from 'uuid/v4';

const generateId = () => Number(uuid().replace(/\D+/g, '')).toString(36);

const checkJson = (entry) => {
  try {
    const jsonEntry = JSON.parse(entry);
    const { blocks } = jsonEntry;
    const stringEntry = blocks[0].text;
    return stringEntry;
  } catch (error) {
    return entry;
  }
};

const generateSlug = (entry) => {
  const slugSalt = checkJson(entry);
  const slug = `${slugify(slugSalt)}-${generateId()}`;
  return slug;
};

export default generateSlug;
