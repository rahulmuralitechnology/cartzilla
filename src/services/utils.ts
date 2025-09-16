import { UploadFile } from "antd";
import * as XLSX from "xlsx";
import { BulkUploadtype } from "./interfaces/product";
import { MenuItem } from "./interfaces/siteConfig";
import { ISiteType } from "./interfaces/common";

export const setLocalStorage = (name: string, data: any) => localStorage.setItem(name, JSON.stringify(data));
export const getLocalStorage = (name: string) => JSON.parse(localStorage.getItem(name) as any);

export const validatePassword = (password: string) => {
  if (!/[a-z]/.test(password)) {
    return "password should cantain atleast one lowercase letter!";
  } else if (!/[0-9]/.test(password)) {
    return "password should cantain atleast one number!";
  } else if (!/[#?!@$%^&*-]/.test(password)) {
    return "password should cantain atleast one special caracter #?!@$%^&*-";
  } else if (password.length < 6) {
    return "password should cantain atleast 6 characters!";
  } else {
    return "";
  }
};

export const getExtension = (filename: string) => {
  var parts = filename?.split("/");
  return parts[parts?.length - 1];
};

export const removeExtension = (filename: string) => {
  var lastDotPosition = filename.lastIndexOf(".");
  if (lastDotPosition === -1) return filename;
  else return filename.substr(0, lastDotPosition);
};

export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export const getDrakRandomColor = () => {
  let colorH = Math.floor(Math.random() * 359),
    colorS = Math.floor(Math.random() * 50) + 60,
    colorL = Math.floor(Math.random() * 5) + 7; // dark colors to adjust
  return `hsl(${colorH}, ${colorS}%, ${colorL}%)`;
};

export const getFileExtension = (fileName: string) => {
  return fileName.substr(fileName.lastIndexOf(".") + 1);
};

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const truncateString = (str: string, num: number) => {
  if (str && str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

export const onPreviewFile = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as any);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};
export const getFileTypeDescription = (fileType: string): BulkUploadtype => {
  switch (fileType) {
    case "text/csv":
      return "csv";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "excel";
    default:
      return "Unknown";
  }
};

/**
 * Converts a file (CSV or Excel) to JSON format.
 * @param fileType - The type of the file: 'csv' or 'excel'.
 * @returns A promise that resolves to the JSON data.
 */
export const convertFileToJson = (file: any, fileType: BulkUploadtype, userId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;

      if (!result) {
        reject(new Error("Failed to read the file."));
        return;
      }

      if (fileType === "csv") {
        resolve([]);
      } else if (fileType === "excel") {
        try {
          const workbook = XLSX.read(result, { type: "binary" });
          const sheetNames = workbook.SheetNames;
          let jsonData = sheetNames.map((sheetName: string) => XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]))[0];
          const updateData = jsonData.map((p: any) => {
            return {
              ...p,
              tags: p?.tags ? [p?.tags?.replace(/^\['|'\]$/g, "")] : [],
              images: p?.images ? [p?.images?.replace(/^\['|'\]$/g, "")] : [],
              userId: userId,
            };
          });
          resolve(updateData);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Unsupported file type. Use "csv" or "excel".'));
      }
    };

    if (fileType === "excel") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const handleExcelMenuUpload = (file: File, callback: (items: MenuItem[]) => void) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<any>(sheet);

    // Convert Excel data to required format
    const items: MenuItem[] = jsonData.map((row: any) => ({
      name: row["Name"],
      price: Number(row["Price"]),
      description: row["Description"],
      image: row["Image URL"],
      dietary: {
        vegetarian: row["Vegetarian"] === "Yes",
        vegan: row["Vegan"] === "Yes",
        glutenFree: row["Gluten-Free"] === "Yes",
        spicy: row["Spicy"] === "Yes",
      },
      category: row["Category"],
    }));

    callback(items);
  };

  reader.readAsArrayBuffer(file);
};

export function isValidStoreName(rule: any, value: string) {
  const regex = /^[a-zA-Z0-9]+$/;
  const isOkay = regex.test(value);
  if (value && value.length < 3) {
    return Promise.reject("Store name must be at least 3 characters long.");
  }
  if (isOkay) {
    return Promise.resolve();
  }
  return Promise.reject("Store name can only include letters and numbers, no spaces or special characters.");
}

export function parseCookies(cookieHeader: string) {
  const cookies: any = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name.trim()] = rest.join("=").trim();
    });
  }
  return cookies;
}

export const downloadConfig = (data: any, name = "config.json") => {
  if (!data || typeof data !== "object") {
    console.error("Invalid data provided for download:", data);
    return;
  }
  let configData = { ...data };
  ["storeId", "id", "store", "userId", "siteType"].forEach((key) => {
    if (key in configData) {
      delete configData[key];
    }
  });

  const filename = `${name}_config_bloomi5.json`;
  const jsonStr = JSON.stringify(configData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getAppType = (appType: ISiteType) => {
  if (appType === "webapp") return "Store";
  if (appType === "website") return "Site";
};

export const getURL = (url: string) => {
  if (url?.startsWith("http://") || url?.startsWith("https://")) {
    return url;
  } else {
    return `https://${url}`;
  }
};

export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const downloadBlobFile = (file: any, contentType: string, name: string) => {
  // Create a URL for the blob
  const url = window.URL.createObjectURL(new Blob([file], { type: contentType }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatIndianCurrency = (amount: number): string => {
  return amount?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};
