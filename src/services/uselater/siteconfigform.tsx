// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Upload,
//   Switch,
//   DatePicker,
//   Button,
//   Card,
//   Collapse,
//   Space,
//   ColorPicker,
//   message,
//   Typography,
//   Layout,
//   Flex,
//   Select,
//   Divider,
// } from "antd";
// import { PlusOutlined, MinusCircleOutlined, SettingFilled } from "@ant-design/icons";
// import type { StoreSiteConfig } from "../../services/interfaces/siteConfig";
// import { Content } from "antd/es/layout/layout";

// const { Panel } = Collapse;
// const { TextArea } = Input;
// const { Title } = Typography;

// const SiteConfig: React.FC = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values: StoreSiteConfig) => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Form values:", values);
//       message.success("Configuration saved successfully!");
//     } catch (error) {
//       message.error("Failed to save configuration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout style={{ background: "#fff", height: "100%" }}>
//       <Content>
//         <Card style={{ boxShadow: "none" }} bordered={false}>
//           <Flex align='center' gap={10}>
//             <Title level={2} className='!mb-0'>
//               Store Configuration
//             </Title>
//           </Flex>

//           <Form
//             form={form}
//             layout='vertical'
//             onFinish={onFinish}
//             initialValues={{
//               banner: {
//                 enabled: false,
//                 backgroundColor: "#f0f0f0",
//                 textColor: "#000000",
//                 cta: {
//                   color: "#1677ff",
//                 },
//               },
//               slider: {
//                 enabled: false,
//                 transition: "fade",
//                 autoplay: {
//                   enabled: true,
//                   interval: 5000,
//                 },
//                 navigation: {
//                   arrowStyle: "light",
//                 },
//                 mobileSettings: {
//                   height: 400,
//                   showCaption: true,
//                   showOverlay: true,
//                 },
//                 slides: [],
//               },
//               hero: {
//                 backgroundImage: "",
//                 ctaText: "Shop Now",
//               },
//               // categories: [],
//               // products: [],
//               offers: [],
//               navigation: [],
//               socialMedia: [],
//               footer: {
//                 sections: [],
//               },
//             }}>
//             <Collapse defaultActiveKey={["hero"]}>
//               {/* Top Banner Configuration */}
//               <Card title='Top Banner' className='mb-8'>
//                 <Form.Item name={["banner", "enabled"]} label='Enable Banner' valuePropName='checked'>
//                   <Switch />
//                 </Form.Item>

//                 <Form.Item
//                   noStyle
//                   shouldUpdate={(prevValues, currentValues) => prevValues.banner?.enabled !== currentValues.banner?.enabled}>
//                   {({ getFieldValue }) =>
//                     getFieldValue(["banner", "enabled"]) && (
//                       <>
//                         <Form.Item
//                           name={["banner", "text"]}
//                           label='Banner Text'
//                           rules={[{ required: true }, { max: 150, message: "Maximum 150 characters allowed" }]}>
//                           <TextArea showCount maxLength={150} placeholder='Enter promotional text' />
//                         </Form.Item>

//                         <Space size='large' className='mb-4'>
//                           <Form.Item name={["banner", "backgroundColor"]} label='Background Color'>
//                             <ColorPicker />
//                           </Form.Item>

//                           <Form.Item name={["banner", "textColor"]} label='Text Color'>
//                             <ColorPicker />
//                           </Form.Item>
//                         </Space>

//                         <Title level={5}>Call-to-Action Button</Title>
//                         <Space size='large' className='mb-4'>
//                           <Form.Item name={["banner", "cta", "text"]} label='Button Text' rules={[{ required: true }]}>
//                             <Input />
//                           </Form.Item>

//                           <Form.Item name={["banner", "cta", "url"]} label='Button URL' rules={[{ required: true }, { type: "url" }]}>
//                             <Input />
//                           </Form.Item>

//                           <Form.Item name={["banner", "cta", "color"]} label='Button Color'>
//                             <ColorPicker />
//                           </Form.Item>
//                         </Space>

//                         <Form.Item
//                           name={["banner", "displayDuration"]}
//                           label='Display Duration (seconds)'
//                           tooltip='Leave empty for permanent display'>
//                           <InputNumber min={1} />
//                         </Form.Item>
//                       </>
//                     )
//                   }
//                 </Form.Item>
//               </Card>

//               {/* Hero Image Slider Settings */}
//               <Card title='Image Slider' className='mb-8'>
//                 <Form.Item name={["slider", "enabled"]} label='Enable Slider' valuePropName='checked'>
//                   <Switch />
//                 </Form.Item>

//                 <Form.Item
//                   noStyle
//                   shouldUpdate={(prevValues, currentValues) => prevValues.slider?.enabled !== currentValues.slider?.enabled}>
//                   {({ getFieldValue }) =>
//                     getFieldValue(["slider", "enabled"]) && (
//                       <>
//                         <Form.List name={["slider", "slides"]}>
//                           {(fields, { add, remove }) => (
//                             <>
//                               {fields.map(({ key, name, ...restField }) => (
//                                 <Card key={key} className='mb-4'>
//                                   <MinusCircleOutlined className='float-right' onClick={() => remove(name)} />
//                                   <Space direction='vertical' className='w-full'>
//                                     <Form.Item
//                                       {...restField}
//                                       name={[name, "imageUrl"]}
//                                       label='Image URL'
//                                       rules={[{ required: true }, { type: "url" }]}
//                                       extra='Recommended size: 1920x1080px. Max file size: 2MB'>
//                                       <Input placeholder='https://example.com/image.jpg' />
//                                     </Form.Item>

//                                     <Form.Item {...restField} name={[name, "altText"]} label='Alt Text' rules={[{ required: true }]}>
//                                       <Input placeholder='Descriptive text for accessibility' />
//                                     </Form.Item>

//                                     <Space size='large'>
//                                       <Form.Item {...restField} name={[name, "title"]} label='Slide Title' rules={[{ required: true }]}>
//                                         <Input />
//                                       </Form.Item>

//                                       <Form.Item {...restField} name={[name, "caption"]} label='Caption'>
//                                         <Input />
//                                       </Form.Item>
//                                     </Space>

//                                     <Form.Item
//                                       {...restField}
//                                       name={[name, "overlayText", "enabled"]}
//                                       label='Enable Overlay Text'
//                                       valuePropName='checked'>
//                                       <Switch />
//                                     </Form.Item>

//                                     <Form.Item
//                                       noStyle
//                                       shouldUpdate={(prevValues, currentValues) =>
//                                         prevValues.slider?.slides?.[name]?.overlayText?.enabled !==
//                                         currentValues.slider?.slides?.[name]?.overlayText?.enabled
//                                       }>
//                                       {({ getFieldValue }) =>
//                                         getFieldValue(["slider", "slides", name, "overlayText", "enabled"]) && (
//                                           <Space size='large'>
//                                             <Form.Item
//                                               {...restField}
//                                               name={[name, "overlayText", "text"]}
//                                               label='Overlay Text'
//                                               rules={[{ required: true }]}>
//                                               <Input />
//                                             </Form.Item>

//                                             <Form.Item
//                                               {...restField}
//                                               name={[name, "overlayText", "position"]}
//                                               label='Position'
//                                               rules={[{ required: true }]}>
//                                               <Select
//                                                 style={{ width: 200 }}
//                                                 options={[
//                                                   { label: "Top Left", value: "top-left" },
//                                                   { label: "Top Center", value: "top-center" },
//                                                   { label: "Top Right", value: "top-right" },
//                                                   { label: "Center Left", value: "center-left" },
//                                                   { label: "Center", value: "center" },
//                                                   { label: "Center Right", value: "center-right" },
//                                                   { label: "Bottom Left", value: "bottom-left" },
//                                                   { label: "Bottom Center", value: "bottom-center" },
//                                                   { label: "Bottom Right", value: "bottom-right" },
//                                                 ]}
//                                               />
//                                             </Form.Item>
//                                           </Space>
//                                         )
//                                       }
//                                     </Form.Item>
//                                   </Space>
//                                 </Card>
//                               ))}
//                               <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
//                                 Add Slide
//                               </Button>
//                             </>
//                           )}
//                         </Form.List>

//                         <Divider />

//                         <Title level={5}>Slider Settings</Title>
//                         <Space size='large' className='mb-4'>
//                           <Form.Item name={["slider", "transition"]} label='Transition Effect'>
//                             <Select
//                               style={{ width: 120 }}
//                               options={[
//                                 { label: "Fade", value: "fade" },
//                                 { label: "Slide", value: "slide" },
//                               ]}
//                             />
//                           </Form.Item>

//                           <Form.Item name={["slider", "autoplay", "enabled"]} label='Enable Autoplay' valuePropName='checked'>
//                             <Switch />
//                           </Form.Item>

//                           <Form.Item
//                             noStyle
//                             shouldUpdate={(prevValues, currentValues) =>
//                               prevValues.slider?.autoplay?.enabled !== currentValues.slider?.autoplay?.enabled
//                             }>
//                             {({ getFieldValue }) =>
//                               getFieldValue(["slider", "autoplay", "enabled"]) && (
//                                 <Form.Item name={["slider", "autoplay", "interval"]} label='Interval (ms)'>
//                                   <InputNumber min={1000} step={500} />
//                                 </Form.Item>
//                               )
//                             }
//                           </Form.Item>
//                         </Space>

//                         <Title level={5}>Navigation Settings</Title>
//                         <Space size='large' className='mb-4'>
//                           <Form.Item name={["slider", "navigation", "arrowStyle"]} label='Arrow Style'>
//                             <Select
//                               style={{ width: 120 }}
//                               options={[
//                                 { label: "Light", value: "light" },
//                                 { label: "Dark", value: "dark" },
//                                 { label: "Custom", value: "custom" },
//                               ]}
//                             />
//                           </Form.Item>

//                           <Form.Item
//                             noStyle
//                             shouldUpdate={(prevValues, currentValues) =>
//                               prevValues.slider?.navigation?.arrowStyle !== currentValues.slider?.navigation?.arrowStyle
//                             }>
//                             {({ getFieldValue }) =>
//                               getFieldValue(["slider", "navigation", "arrowStyle"]) === "custom" && (
//                                 <Form.Item name={["slider", "navigation", "customColor"]} label='Custom Color'>
//                                   <ColorPicker />
//                                 </Form.Item>
//                               )
//                             }
//                           </Form.Item>
//                         </Space>

//                         <Title level={5}>Mobile Settings</Title>
//                         <Space size='large'>
//                           <Form.Item name={["slider", "mobileSettings", "height"]} label='Mobile Height (px)'>
//                             <InputNumber min={200} max={800} />
//                           </Form.Item>

//                           <Form.Item name={["slider", "mobileSettings", "showCaption"]} label='Show Caption' valuePropName='checked'>
//                             <Switch />
//                           </Form.Item>

//                           <Form.Item name={["slider", "mobileSettings", "showOverlay"]} label='Show Overlay' valuePropName='checked'>
//                             <Switch />
//                           </Form.Item>
//                         </Space>
//                       </>
//                     )
//                   }
//                 </Form.Item>
//               </Card>

//               {/* Hero Section */}
//               <Panel header='Hero Section' key='hero'>
//                 <Form.Item name={["hero", "title"]} label='Hero Title' rules={[{ required: true, message: "Please enter hero title" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name={["hero", "subtitle"]} label='Hero Subtitle' rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name={["hero", "backgroundImage"]} label='Background Image URL' rules={[{ required: true }, { type: "url" }]}>
//                   <Input placeholder='https://example.com/image.jpg' />
//                 </Form.Item>
//                 <Space>
//                   <Form.Item name={["hero", "ctaText"]} label='CTA Text' rules={[{ required: true }]}>
//                     <Input />
//                   </Form.Item>
//                   <Form.Item name={["hero", "ctaLink"]} label='CTA Link' rules={[{ required: true }, { type: "url" }]}>
//                     <Input />
//                   </Form.Item>
//                 </Space>
//               </Panel>

//               {/* Categories Section */}
//               {/* <Panel header='Categories' key='categories'>
//                 <Form.List name='categories'>
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <Card key={key} className='mb-4'>
//                           <MinusCircleOutlined className='float-right' onClick={() => remove(name)} />
//                           <Form.Item {...restField} name={[name, "name"]} label='Category Name' rules={[{ required: true }]}>
//                             <Input />
//                           </Form.Item>
//                           <Form.Item {...restField} name={[name, "description"]} label='Description'>
//                             <TextArea />
//                           </Form.Item>
//                           <Form.Item {...restField} name={[name, "image"]} label='Image URL' rules={[{ type: "url" }]}>
//                             <Input />
//                           </Form.Item>
//                         </Card>
//                       ))}
//                       <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
//                         Add Category
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//               </Panel> */}

//               {/* Brand Settings
//               <Panel header='Brand Settings' key='brand'>
//                 <Form.Item name={["brand", "name"]} label='Brand Name' rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name={["brand", "logo"]} label='Logo URL' rules={[{ required: true }, { type: "url" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Space>
//                   <Form.Item name={["brand", "primaryColor"]} label='Primary Color'>
//                     <ColorPicker />
//                   </Form.Item>
//                   <Form.Item name={["brand", "secondaryColor"]} label='Secondary Color'>
//                     <ColorPicker />
//                   </Form.Item>
//                 </Space>
//               </Panel> */}

//               {/* Contact Information */}
//               <Panel header='Contact Information' key='contact'>
//                 <Form.Item name={["contact", "email"]} label='Email' rules={[{ required: true }, { type: "email" }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name={["contact", "phone"]} label='Phone' rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//                 <Form.Item name={["contact", "address"]} label='Address' rules={[{ required: true }]}>
//                   <TextArea />
//                 </Form.Item>
//                 <Form.Item name={["contact", "supportHours"]} label='Support Hours'>
//                   <Input placeholder='e.g., Mon-Fri 9AM-5PM EST' />
//                 </Form.Item>
//               </Panel>

//               {/* Social Media */}
//               <Panel header='Social Media' key='social'>
//                 <Form.List name='socialMedia'>
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <Space key={key} className='block mb-4' style={{ width: "100%" }} align='baseline'>
//                           <Form.Item {...restField} name={[name, "platform"]} rules={[{ required: true }]}>
//                             <Input placeholder='Platform' />
//                           </Form.Item>
//                           <Form.Item {...restField} name={[name, "url"]} rules={[{ required: true }, { type: "url" }]}>
//                             <Input placeholder='URL' />
//                           </Form.Item>
//                           <MinusCircleOutlined onClick={() => remove(name)} />
//                         </Space>
//                       ))}
//                       <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
//                         Add Social Media Link
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//               </Panel>

//               {/* Footer Settings */}
//               {/* <Panel header='Footer Settings' key='footer'>
//                 <Form.List name={["footer", "sections"]}>
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <Card key={key} className='mb-4'>
//                           <MinusCircleOutlined className='float-right' onClick={() => remove(name)} />
//                           <Form.Item {...restField} name={[name, "title"]} label='Section Title' rules={[{ required: true }]}>
//                             <Input />
//                           </Form.Item>
//                           <Form.List name={[name, "links"]}>
//                             {(linkFields, { add: addLink, remove: removeLink }) => (
//                               <>
//                                 {linkFields.map(({ key: linkKey, name: linkName, ...restLinkField }) => (
//                                   <Space key={linkKey} className='block mb-4' align='baseline'>
//                                     <Form.Item {...restLinkField} name={[linkName, "label"]} rules={[{ required: true }]}>
//                                       <Input placeholder='Link Label' />
//                                     </Form.Item>
//                                     <Form.Item {...restLinkField} name={[linkName, "url"]} rules={[{ required: true }, { type: "url" }]}>
//                                       <Input placeholder='URL' />
//                                     </Form.Item>
//                                     <MinusCircleOutlined onClick={() => removeLink(linkName)} />
//                                   </Space>
//                                 ))}
//                                 <Button type='dashed' onClick={() => addLink()} block icon={<PlusOutlined />}>
//                                   Add Link
//                                 </Button>
//                               </>
//                             )}
//                           </Form.List>
//                         </Card>
//                       ))}
//                       <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
//                         Add Footer Section
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
//                 <Form.Item name={["footer", "copyright"]} label='Copyright Text' rules={[{ required: true }]}>
//                   <Input />
//                 </Form.Item>
//               </Panel> */}
//             </Collapse>

//             <Form.Item style={{ marginTop: "30px" }}>
//               <Button type='primary' htmlType='submit' loading={loading} size='large'>
//                 Save Configuration
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </Content>
//     </Layout>
//   );
// };

// export default SiteConfig;
