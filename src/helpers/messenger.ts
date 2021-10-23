export default (code = 500, data: Object, message?: string) => {
  if (code >= 400) {
    if (typeof message === "undefined") {
      switch (code) {
        case 400:
          message = "Invalid request";
        case 401:
          message = "Anda tidak memiliki akses yang cukup";
        case 404:
          message = "Objek atau dokument tidak ditemukan";
        case 409:
          message = "Terlalu banyak permintaan, coba lagi nanti";
        default:
          message = "Server cannot handling request at this moment, please try again later";
      }
    }
    return { success: false, message, errors: data };
  } else {
    return { success: true, data, message };
  }
};
