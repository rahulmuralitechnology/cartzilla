"use client";

import type React from "react";
import { useState } from "react";
import { Modal, Button, Typography, List, Input } from "antd";
import { ArrowRightOutlined, CheckCircleFilled, RocketOutlined } from "@ant-design/icons";
import "./StarterCongratulation.scss";

const { Title, Paragraph } = Typography;

interface CongratulationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      maskClosable={false}
      closeIcon={false}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className='congratulations-modal'
      centered>
      <div className='modal-content congratulations-modal'>
        <div className='modal-header'>
          <CheckCircleFilled className='success-icon' />
          <Title level={3}>Congratulations!</Title>
          <Paragraph className='subtitle'>Coupon code applied</Paragraph>
        </div>
      </div>
    </Modal>
  );
};

export default CongratulationsModal;
