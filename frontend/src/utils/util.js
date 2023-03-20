export const timestampToDate = (timestamp) => {
  let date1 = new Date(timestamp);
  return date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8); 
}