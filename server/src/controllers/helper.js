function formatDate(dateString, otherFormat) {
  if (otherFormat) {
    return `${new Date(dateString).toLocaleDateString()}T${new Date(dateString).toLocaleTimeString()}`;
  }
  return `${new Date(dateString).toLocaleDateString()} ${new Date(dateString).toLocaleTimeString()}`;
}

export {
  formatDate,
};
