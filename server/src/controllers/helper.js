function formatDate(dateString, toIsoString = false) {
  const date = new Date(dateString).toISOString();

  if (toIsoString) {
    return date;
  }

  return date.replace(/T/, ' ').replace(/\..+/, '');
}

export {
  formatDate,
};
