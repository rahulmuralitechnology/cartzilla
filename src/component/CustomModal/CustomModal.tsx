import React, { FC, useRef, useState } from "react";
import "./CustomModal.scss";
import { Modal } from "antd";

const CustomModel: FC<{
  modelClsName?: string;
  isModalOpen: boolean;
  modalOkbtn?: () => void;
  modalCancelbtn: () => void;
  modelName?: any;
  style?: React.CSSProperties;
  children: React.ReactElement;
  width?: number | string;
  height?: number | string;
  maskClosable?: boolean;
}> = ({ modelClsName, modelName, isModalOpen, modalOkbtn, modalCancelbtn, children, style, width, height, maskClosable }) => {
  const [disabled, setDisabled] = useState(false);
  const draggleRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      maskClosable={maskClosable}
      destroyOnClose={true}
      centered={true}
      title={
        <div
          ref={draggleRef}
          style={{
            width: "100%",
            cursor: "move",
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}>
          {modelName ? modelName : null}
        </div>
      }
      style={{ ...style }}
      width={width}
      className={`${modelClsName} custom-modal-wrapper`}
      open={isModalOpen}
      footer={null}
      onCancel={modalCancelbtn}>
      {children}
    </Modal>
  );
};

export default CustomModel;
