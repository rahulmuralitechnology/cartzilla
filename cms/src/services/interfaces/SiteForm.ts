import { ISiteType } from "./common";
import { FAQCollection } from "./siteConfig";

export interface LandingSiteConfig {
  siteType: ISiteType;
  siteInfo: {
    name: string;
    logo: string;
  };
  navbar: {
    whatsappButton: {
      text: string;
      link: string;
      lightModeStyles: string;
      darkModeStyles: string;
    };
  };
  hero: {
    badge: {
      icon: string;
      text: string;
    };
    heading: {
      line1: string;
      line2: string;
    };
    description: string;
    ctaButtons: Array<{
      text: string;
      type: "primary" | "secondary";
      icon?: string;
      path?: string;
    }>;
    metrics: Array<{
      value: string;
      label: string;
    }>;
    backgroundImage: string;
    backgroundImageFile?: any[] | null;
  };
  faq: FAQCollection;
  portfolio: {
    sectionTitle: string;
    subtitle: string;
    description: string;
    projects: Array<{
      id: number;
      title: string;
      category: string;
      image: string;
      description: string;
      stats: {
        area: string;
        duration: string;
        year: string;
      };
    }>;
    autoPlayInterval: number;
  };
  about: {
    title: string;
    mainDescription: string;
    achievements: Array<{
      number: string;
      label: string;
    }>;
    values: Array<string>;
    image: string;
    vision: {
      title: string;
      description1: string;
      description2: string;
      ctaButton: {
        text: string;
      };
    };
    process: {
      title: string;
      steps: Array<{
        title: string;
        description: string;
      }>;
    };
  };
  services: {
    pageTitle: string;
    subtitle: string;
    description: string;
    servicesList: Array<{
      icon: string;
      title: string;
      description: string;
      features: Array<string>;
    }>;
    cta: {
      title: string;
      description: string;
      buttonText: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    contactDetails: {
      address: string;
      email: string;
      phone: string;
      whatsapp: string;
    };
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      x?: string;
    };
    mapUrl: string;
  };
  footer: {
    companyName: string;
    description: string;
    socialLinks: Array<{
      platform: "facebook" | "instagram" | "linkedin";
      url: string;
    }>;
    quickLinks: Array<{
      label: string;
      url: string;
    }>;
    services: Array<{
      label: string;
      url: string;
    }>;
    copyright: string;
  };
  testimonials: {
    sectionTitle: string;
    sectionDescription: string;
    testimonials: Array<{
      id: number;
      content: string;
      author: string;
      role: string;
      image: string;
    }>;
  };
  gallery: {
    categories: Array<{
      name: string;
      images: Array<{
        url: string;
        caption?: string;
        alt?: string;
      }>;
    }>;
  };
}
