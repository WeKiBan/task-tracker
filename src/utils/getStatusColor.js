import { statusColors } from "../config"

export const getStatusColor = (status) => {
  // Split the status string into words
  const words = status.split(' ');


  // Capitalize the first letter of each word (except the first word)
  const capitalizedWords = words.map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)));

  // Join the words together with no spaces
  const camelCaseStatus = capitalizedWords.join('');

  // Return the camelCase status
  return statusColors[camelCaseStatus];
}