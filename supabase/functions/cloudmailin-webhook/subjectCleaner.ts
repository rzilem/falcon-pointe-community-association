
/**
 * Cleans email subjects to make them more user-friendly
 * Removes ticket numbers, extra whitespace, and other email artifacts
 */
export function cleanEmailSubject(subject: string): string {
  if (!subject || subject.trim() === '') {
    return `Announcement - ${new Date().toLocaleDateString()}`;
  }
  
  let cleanedSubject = subject
    // Remove ticket numbers in square brackets like [#XN4713935]
    .replace(/\s*-\s*\[#[A-Z0-9]+\]\s*$/i, '')
    // Remove standalone ticket numbers at the end
    .replace(/\s*\[#[A-Z0-9]+\]\s*$/i, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove leading/trailing whitespace
    .trim();
  
  // If we accidentally removed everything, create a fallback
  if (!cleanedSubject || cleanedSubject.length < 3) {
    cleanedSubject = `Announcement - ${new Date().toLocaleDateString()}`;
  }
  
  return cleanedSubject;
}
