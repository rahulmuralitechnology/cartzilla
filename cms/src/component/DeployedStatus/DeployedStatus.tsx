import React from "react";
import { Button, Progress } from "antd";
import "./DeployedStatus.scss";

const DeployStatus: React.FC = () => {
  return (
    <div className='deploy-status-container'>
      <div className='deploy-status-content'>
        <h1>
          Please Wait While We are
          <br />
          <span className='highlight'>Deploying</span> Your
          <br />
          Site!
        </h1>

        <div className='status-indicator'>
          <Progress
            type='circle'
            percent={100}
            strokeColor={{
              "0%": "#8b5cf6",
              "100%": "#6d28d9",
            }}
            format={() => ""}
            status='active'
            strokeLinecap='round'
            strokeWidth={8}
          />
        </div>

        <p className='status-message'>Your site is being deployed. This may take a few minutes. </p>

        {/* <Button type='primary' className='view-website-btn' icon={<span>→</span>}>
          View Your Website
        </Button> */}
      </div>

      <div className='background-illustrations'>
        <img src='/assets/publish-bg.svg' alt='' className='illustration-left' />
      </div>
    </div>
  );
};

export default DeployStatus;
