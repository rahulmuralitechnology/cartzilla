import React, { FC } from "react";
import StorePageForm from "../../component/CMSManagement/StorePageForm/StorePageForm";
import "../../styles/SitePageForm.scss";

const StorePages: FC = () => {
  return (
    <section className='bloomi5_page site_form_page '>
      <StorePageForm />
    </section>
  );
};

export default StorePages;
