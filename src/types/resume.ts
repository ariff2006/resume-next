export interface Translation {
  [key: string]: any;
}

export interface Meta {
  lastUpdated: string;
}

export interface Label {
  summaryTitle: string;
  experienceTitle: string;
  educationTitle: string;
  skillsTitle: string;
  certsTitle: string;
  keyResult: string;
  footer: string;
}

export interface Personal {
  email: string;
  phone: string;
  photo?: string;
  translations: {
    th: {
      name: string;
      title: string;
      location: string;
      dob: string;
      summary: string;
    };
    en: {
      name: string;
      title: string;
      location: string;
      dob: string;
      summary: string;
    };
    zh: {
      name: string;
      title: string;
      location: string;
      dob: string;
      summary: string;
    };
  };
}

export interface Experience {
  id: string;
  translations: {
    [key: string]: {
      title: string;
      org: string;
      meta: string;
      bullets: string[];
      highlight?: string;
    };
  };
}

export interface Education {
  id: string;
  translations: {
    [key: string]: {
      title: string;
      org: string;
      meta: string;
    };
  };
}

export interface Skill {
  id: string;
  tags: string[];
  translations: {
    [key: string]: {
      label: string;
    };
  };
}

export interface Cert {
  id: string;
  file?: string;
  translations: {
    [key: string]: {
      name: string;
      org: string;
    };
  };
}

export interface ResumeData {
  meta: Meta;
  labels: {
    [key: string]: Label;
  };
  personal: Personal;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certs: Cert[];
}
