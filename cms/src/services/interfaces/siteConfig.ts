import { ISiteType } from "./common";

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface FAQCollection {
  items: QuestionAnswer[];
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface NavigationItem {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: Array<{ label: string; url: string }>;
}

export interface StoreAboutSection {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface StoreSiteConfig {
  siteType: ISiteType;
  about: any;
  banner: {
    enabled: boolean;
    banners: BannerConfig[];
  };
  slider: {
    enabled: boolean;
    slides?: SlideConfig[];
    transition?: "fade" | "slide";
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    backgroundImageFile?: any[] | null;
    ctaText: string;
    ctaLink: string;
  };
  navigation: NavigationItem[];
  contact: {
    email: string;
    phone: string;
    address: string;
    supportHours: string;
  };
  faq: FAQCollection;
  socialMedia: SocialMedia[];
  storeId?: string;
  userId?: string;
  id?: string;
  subdomain?: string;
  createdAt?: string;
  updatedAt?: string;
  gstInfo?: {
    gstin?: string; // GST Identification Number (15-digit)
    gstRegistrationType?: "Regular" | "Composition" | "Exempted"; // GST registration type
    pan?: string; // Permanent Account Number (linked with GST)
    state?: string; // Store's registered state (for IGST/CGST/SGST calculations)
  };
  ecommerce: any;
  seo: any;
  websiteServices: any;
  // footer: {
  //   sections: FooterSection[];
  //   copyright: string;
  // };
}

export interface BannerConfig {
  text: string;
  page: string;
}

export interface SlideConfig {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  title: string;
  overlayText?: {
    enabled: boolean;
    text: string;
    position:
      | "top-left"
      | "top-center"
      | "top-right"
      | "center-left"
      | "center"
      | "center-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
  };
}

export interface SliderConfig {
  enabled: boolean;
  slides?: SlideConfig[];
  transition?: "fade" | "slide";
}

export interface HeroConfig {
  banner: BannerConfig[];
  slider: SliderConfig;
}

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
  };
  category: string;
  userId?: string;
  storeId?: string;
}

export interface RestaurantConfig {
  siteType: ISiteType;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
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
    mapUrl: string;
  };
  faq: FAQCollection;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  hours: Array<{
    day: string;
    open: string;
    close: string;
  }>;
  homepage: {
    hero: {
      heading: string;
      subheading: string;
      backgroundImage: string;
      cta: {
        primary: {
          text: string;
          link: string;
        };
        secondary: {
          text: string;
          link: string;
        };
      };
    };
    about: {
      title: string;
      description: string;
      image: string;
      stats: Array<{
        label: string;
        value: string;
      }>;
    };
    features: {
      title: string;
      subtitle: string;
      items: Array<{
        id: string;
        title: string;
        description: string;
        image: string;
      }>;
    };
    specialMenu: {
      title: string;
      subtitle: string;
      items: MenuItem[];
    };
    testimonials: {
      title: string;
      subtitle: string;
      items: Array<{
        id: string;
        author: string;
        role: string;
        content: string;
        image: string;
        rating: number;
      }>;
    };
    gallery: {
      title: string;
      subtitle: string;
      items: Array<{
        id: string;
        image: string;
        title: string;
        category: string;
      }>;
    };
    cta: {
      title: string;
      subtitle: string;
      buttonText: string;
      buttonLink: string;
      backgroundImage: string;
    };
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

export interface IBloomi5LandingPage {
  siteType: ISiteType;
  faq?: FAQCollection;
  hero: {
    title: {
      start: string;
      highlight1: string;
      middle: string;
      highlight2: string;
      preEnd: string;
      highlight3: string;
      end: string;
    };
    description: string;
    descriptionHighlight: string;
    descriptionEnd: string;
    ctaButtons: {
      primary: {
        text: string;
        url: string;
      };
      secondary: {
        text: string;
        url: string;
      };
    };
    heroImage: string;
    heroImageAlt: string;
    features: Array<{
      value: string;
      label: string;
      gradient: string;
    }>;
    statsBar: Array<{
      label: string;
      value: string;
    }>;
  };
  about: {
    sectionId: string;
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    image: string;
    imageAlt: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    phone: string;
    address: string;
    formHeading: string;
    formSubheading: string;
    mapUrl: string;
  };
  ecommerce: any;
  seo: any;
  websiteServices: any;
}
