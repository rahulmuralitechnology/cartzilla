import { Modal, Spin, Timeline, Typography, Button } from "antd";

import shippingService from "../../../../services/shippingService";
import { useEffect, useState } from "react";
import { Order } from "../../../../services/orderService";
import { ShiprocketTrackingActivity, ShiprocketTrackingData } from "../../../../services/interfaces/shippingTypes";

const { Title, Text } = Typography;

const OrderTrackingModal = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const [trackingData, setTrackingData] = useState<ShiprocketTrackingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order.trackingNo) {
      fetchTrackingData();
    }
  }, []);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const response = await shippingService.trackShipment(order.trackingNo!);
      console.log(response.data.trackingData); // Add this line for debugging informati
      //   setTrackingData(response.data.trackingData);
    } catch (err) {
      console.error("Failed to fetch tracking data");
    }
    setLoading(false);
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={[
        <Button key='close' type='primary' onClick={onClose}>
          Close
        </Button>,
      ]}
      title={<Title level={4}>Track Order #{order?.orderId}</Title>}
      width={600}
      className='tracking-modal'>
      {loading ? (
        <div className='loading-container'>
          <Spin size='large' />
          <Text className='loading-text'>Fetching tracking details...</Text>
        </div>
      ) : (
        <div className='tracking-content'>
          <div className='tracking-info'>
            <Text strong>AWB Code: {trackingData?.shipment_track[0].awb_code}</Text>
            <Text type='secondary'>Courier: --</Text>
            <Text type='secondary'>Status: {order.status}</Text>
          </div>

          {trackingData && (
            <div className='tracking-history'>
              <Title level={5}>Tracking History:</Title>
              <Timeline>
                {trackingData.shipment_track_activities?.map((track: ShiprocketTrackingActivity, index: number) => (
                  <Timeline.Item key={index} dot={<div className='timeline-dot' />}>
                    <Text strong>{track.activity}</Text>
                    <br />
                    <Text type='secondary'>{track.date}</Text>
                    <br />
                    <Text type='secondary' className='location-text'>
                      {track.location}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default OrderTrackingModal;
