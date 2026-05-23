const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/data/resume-data.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// ---------------------------------------------------------
// 1. UPDATE SKILLS
// ---------------------------------------------------------
data.skills = [
  {
    id: "sk-1",
    tags: ["Cisco", "Fortigate 100F", "Sophos", "Zyxel", "TP-Link Omada", "Mikrotik"],
    translations: {
      th: { label: "Network" },
      en: { label: "Network" },
      zh: { label: "网络" }
    }
  },
  {
    id: "sk-2",
    tags: ["Windows Server", "Active Directory", "GPO", "VMware", "Hyper-V", "Proxmox", "Nutanix"],
    translations: {
      th: { label: "Server / OS" },
      en: { label: "Server / OS" },
      zh: { label: "服务器 / 操作系统" }
    }
  },
  {
    id: "sk-3",
    tags: ["Firewall Policy", "VPN", "MFA", "IPS/IDS", "ESET", "Web Filtering"],
    translations: {
      th: { label: "Security" },
      en: { label: "Security" },
      zh: { label: "安全" }
    }
  },
  {
    id: "sk-4",
    tags: ["Microsoft 365", "Exchange", "Teams", "Google Workspace"],
    translations: {
      th: { label: "Cloud / SaaS" },
      en: { label: "Cloud / SaaS" },
      zh: { label: "云 / SaaS" }
    }
  },
  {
    id: "sk-5",
    tags: ["Mango ERP", "Oracle ERP", "SQL Server", "Sybase"],
    translations: {
      th: { label: "ERP / Database" },
      en: { label: "ERP / Database" },
      zh: { label: "ERP / 数据库" }
    }
  },
  {
    id: "sk-6",
    tags: ["SQL", "PHP", "JavaScript", "CSS", "Python", "HTML5", "Google Apps Script"],
    translations: {
      th: { label: "ภาษาโปรแกรม" },
      en: { label: "Programming" },
      zh: { label: "编程语言" }
    }
  },
  {
    id: "sk-7",
    tags: ["Veeam", "Synology NAS", "Shadow Copy"],
    translations: {
      th: { label: "Backup" },
      en: { label: "Backup" },
      zh: { label: "备份" }
    }
  },
  {
    id: "sk-8",
    tags: ["ไทย (Native)", "อังกฤษ (เริ่มต้น)"],
    translations: {
      th: { label: "ภาษาพูด" },
      en: { label: "Spoken Languages" },
      zh: { label: "语言" }
    }
  }
];

// ---------------------------------------------------------
// 2. UPDATE EDUCATION
// ---------------------------------------------------------
data.education = [
  {
    id: "edu-1",
    translations: {
      th: {
        title: "วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีสารสนเทศและการสื่อสาร",
        org: "มหาวิทยาลัยสุโขทัยธรรมาธิราช",
        meta: "คาดว่าจบ 2570 | GPA 3.0"
      },
      en: {
        title: "B.Sc. in Information and Communications Technology",
        org: "Sukhothai Thammathirat Open University",
        meta: "Expected 2027 | GPA 3.0"
      },
      zh: {
        title: "信息与通信技术理学学士",
        org: "素可泰他玛提叻开放大学",
        meta: "预计 2027 年毕业 | GPA 3.0"
      }
    }
  },
  {
    id: "edu-2",
    translations: {
      th: {
        title: "ประกาศนียบัตรวิชาชีพ (ปวช.) สาขาเทคโนโลยีระบบเสียง",
        org: "วิทยาลัยเทคนิคนางรอง",
        meta: "จบ 2545 | GPA 2.25"
      },
      en: {
        title: "Vocational Certificate in Sound Technology",
        org: "Nang Rong Technical College",
        meta: "Graduated 2002 | GPA 2.25"
      },
      zh: {
        title: "音响技术职业证书",
        org: "南荣技术学院",
        meta: "2002年毕业 | GPA 2.25"
      }
    }
  }
];

// Save
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Update Complete');
