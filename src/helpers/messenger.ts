const msg = (code: number, data: Object, message?: string) => {
  if (code >= 400) {
    if (!message) {
      if (code >= 400 && !message) message = "Invalid request";
      if (code == 401 && !message)
        message = "Anda tidak memiliki akses yang cukup";
      if (code == 404 && !message) message = "Objek tidak ditemukan";
      if (code >= 500 && !message)
        message = "Server cannot handling this request at this moment, please try again later";
    }
    let success = false;
    return { success, message, errors: data };
  } else {
    let success = true;
    return { success, data, message };
  }
};

export default msg;
