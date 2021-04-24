import { NewSpeakerType } from "../../types";

/**
 * @description basic form validation
 * @param {Object} objFormData form data
 * @returns {Boolean} valid or not
 */
export const validateForm = (objFormData: NewSpeakerType) => {
  let bisValid = true;
  Object.entries(objFormData).forEach(([key, value]) => {
    if (key !== "favorite") {
      bisValid = bisValid && (value as string).trim().length > 0;
    }
  });
  return bisValid;
};
