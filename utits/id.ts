export function generateRandomId(): string {
  const timestamp: number = Date.now(); // Get current timestamp in milliseconds
  const randomStr: string = Math.random().toString(36).substring(2, 10); // Generate random base-36 string of length 8
  const randomNum: string = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0'); // Generate random 6-digit number
  const id: string = `${timestamp}-${randomStr}-${randomNum}`; // Concatenate timestamp, random string, and random number
  return id;
}
