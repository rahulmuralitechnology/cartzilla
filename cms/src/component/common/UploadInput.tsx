import { message, Upload, UploadFile } from "antd";
import React, { FC, useEffect, useState } from "react";
import appConstant from "../../services/appConstant";
import { PlusOutlined } from "@ant-design/icons";
import { onPreviewFile } from "../../services/utils";

const UploadInput: FC<{
  onUploadRes: (res: UploadFile) => void;
  maxCount?: number;
  imageUrl: string[] | string;
  onDelete?: (url: string) => void;
}> = ({ onUploadRes, onDelete = () => {}, maxCount = 1, imageUrl }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (Array.isArray(imageUrl) && imageUrl?.length > 0) {
      setFileList(
        imageUrl.map((url, index) => ({
          uid: `${index}`, // Unique ID for each file
          name: `image-${index + 1}.png`, // Generate a name for each file
          status: "done",
          url: url, // Use the individual URL
        }))
      );
    } else {
      setFileList([{ uid: "-1", name: "image.png", status: "done", url: imageUrl as string }]);
    }
  }, [imageUrl]);

  return (
    <Upload
      listType='picture-card'
      maxCount={maxCount}
      method='POST'
      multiple={maxCount > 1}
      fileList={fileList}
      onPreview={onPreviewFile}
      action={`${appConstant.BACKEND_API_URL}/common/upload-file`}
      data={(file) => {
        return {
          fileName: `${new Date().getTime()}-${file.name}`,
          contentType: file.type,
        };
      }}
      headers={{
        Authorization: `Bearer ${localStorage.getItem(appConstant.AUTH_TOKEN)}` || "",
      }}
      onRemove={(file) => {
        onDelete(file.url as string);
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      }}
      beforeUpload={beforeUpload}
      onChange={(info) => {
        setFileList(info.fileList);
        if (info.file.status === "done") {
          onUploadRes(info.file);
        }
      }}>
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    </Upload>
  );
};

export default UploadInput;
