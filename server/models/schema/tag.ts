import mongoose from "mongoose";
import { ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 * 
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */

const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  {
    name: {
      type: String,
      required: true
    }
  },
  { collection: "Tag" }
);

/**
 * Static method to find existing tags by name or create new tags if they don't exist
 * @param tagNames - Array of tag names to find or create
 * @returns Promise that resolves to an array of tag documents
 */
TagSchema.static('findOrCreateMany', async function(tagNames: string[]) {
  const uniqueTagNames = [...new Set(tagNames)];
  const existingTags = await this.find({ name: { $in: uniqueTagNames } }).exec();
  
  const existingTagNames = existingTags.map(tag => tag.name);
  const newTagNames = uniqueTagNames.filter(name => !existingTagNames.includes(name));
  
  if (newTagNames.length > 0) {
    const newTags = await this.insertMany(newTagNames.map(name => ({ name })));
    return [...existingTags, ...newTags];
  }
  
  return existingTags;
});

/**
 * Static method to validate that all tag IDs exist in the database
 * @param tagIds - Array of tag IDs to validate
 * @returns Promise that resolves to a boolean indicating if all tags exist
 */
TagSchema.static('validateTags', async function(tagIds: mongoose.Types.ObjectId[]) {
  const count = await this.countDocuments({ _id: { $in: tagIds } }).exec();
  return count === tagIds.length;
});

export default TagSchema;
