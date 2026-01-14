/**
 * Masks a phone number for privacy, showing only the first and last few digits
 * @param phone - The full phone number
 * @returns Masked phone number (e.g., "+20 1XX XXX XXXX" -> "+20 1** *** **67")
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 6) return '***********';
  
  // Keep first 5 characters and last 2 characters
  const start = phone.slice(0, 5);
  const end = phone.slice(-2);
  const middleLength = Math.max(0, phone.length - 7);
  const masked = '*'.repeat(middleLength);
  
  return `${start}${masked}${end}`;
}

/**
 * Checks if the current user can see the phone number for a lead
 * @param isAdmin - Whether the current user is an admin
 * @param currentUserId - The current user's ID
 * @param assignedTo - The lead's assigned user ID
 * @returns Whether the phone should be visible
 */
export function canViewLeadPhone(
  isAdmin: boolean,
  currentUserId: string | undefined,
  assignedTo: string | undefined
): boolean {
  // Admins can see all phones
  if (isAdmin) return true;
  
  // Sales can only see phones of leads assigned to them
  return !!currentUserId && currentUserId === assignedTo;
}

/**
 * Checks if the current user can see the phone number for a unit
 * @param isAdmin - Whether the current user is an admin
 * @param currentUserId - The current user's ID
 * @param addedBy - The unit's creator user ID
 * @returns Whether the phone should be visible
 */
export function canViewUnitPhone(
  isAdmin: boolean,
  currentUserId: string | undefined,
  addedBy: string | undefined
): boolean {
  // Admins can see all phones
  if (isAdmin) return true;
  
  // Sales can only see phones of units they added
  return !!currentUserId && currentUserId === addedBy;
}
