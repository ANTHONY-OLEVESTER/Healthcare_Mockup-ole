export const mainPages = [
  {
    id: "home",
    label: "Home",
    side: "left",
    z: 0,
    title: "Care that feels human. Technology that stays invisible.",
    subtitle: "Fast appointments, clear answers, and follow-ups that actually follow up.",
    bullets: [
      "Same-day consults (when available)",
      "Transparent pricing & reports",
      "Digital prescriptions + records"
    ],
    cta: "Book an Appointment",
    image: "/assets/images/home.jpg",
    clickable: false
  },
  {
    id: "services",
    label: "Services",
    side: "right",
    z: 0,
    title: "Services built around outcomes, not departments.",
    subtitle: "From prevention to diagnosis to recovery -- one coordinated system.",
    bullets: [
      "General Consultation",
      "Diagnostics & Imaging",
      "Preventive Health Packages"
    ],
    cta: "Explore Services",
    image: "/assets/images/services.jpg",
    clickable: true
  },
  {
    id: "mission",
    label: "Mission",
    side: "left",
    z: -6,
    title: "We exist to make healthcare simpler, faster, and kinder.",
    subtitle: "No confusion. No running around. No 'come tomorrow' loop.",
    bullets: [
      "Patient-first processes",
      "Evidence-based practice",
      "Respect for your time"
    ],
    cta: "See Our Mission",
    image: "/assets/images/mission.png",
    clickable: false
  },
  {
    id: "careers",
    label: "Careers",
    side: "right",
    z: -6,
    title: "Work where the standard is excellence -- and the culture is calm.",
    subtitle: "We hire people who are good at care, and good to each other.",
    bullets: [
      "Doctors & Specialists",
      "Nursing & Support Staff",
      "Admin & Operations"
    ],
    cta: "View Open Roles",
    image: "/assets/images/careers.jpg",
    clickable: true
  },
  {
    id: "referrals",
    label: "Referral",
    side: "left",
    z: -12,
    title: "Referrals that don't break the patient's flow.",
    subtitle: "Send a patient. We update you. Everyone stays aligned.",
    bullets: [
      "Easy referral form",
      "Priority triage (where applicable)",
      "Reports shared back promptly"
    ],
    cta: "Refer a Patient",
    image: "/assets/images/referrals.jpg",
    clickable: false
  },
  {
    id: "contact",
    label: "Contact",
    side: "right",
    z: -12,
    title: "Reach us in one tap -- not five calls.",
    subtitle: "Appointments, directions, billing support -- all here.",
    bullets: [
      "Call / WhatsApp",
      "Location + map",
      "Support timings"
    ],
    cta: "Contact Now",
    image: "/assets/images/contact.jpg",
    clickable: false
  }
];

export const detailPages = {
  services: [
    {
      id: "svc_consult",
      title: "General Consultation",
      subtitle: "Primary care and specialist consults",
      bullets: ["Walk-in & appointment", "Follow-up plans", "Digital prescriptions"],
      cta: "Book Consult",
      image: "/assets/images/svc_consult.jpg"
    },
    {
      id: "svc_imaging",
      title: "Diagnostics & Imaging",
      subtitle: "Clear results, fast reporting",
      bullets: ["MRI / CT / X-ray", "Expert radiology review", "Digital reports"],
      cta: "View Diagnostics",
      image: "/assets/images/svc_imaging.jpg"
    },
    {
      id: "svc_lab",
      title: "Lab Tests",
      subtitle: "In-house sampling & trusted partners",
      bullets: ["Routine bloodwork", "Health panels", "Fast turnaround"],
      cta: "Book Lab Test",
      image: "/assets/images/svc_lab.jpg"
    },
    {
      id: "svc_prevent",
      title: "Preventive Packages",
      subtitle: "Catch issues early",
      bullets: ["Annual checkups", "Lifestyle screenings", "Custom packages"],
      cta: "See Packages",
      image: "/assets/images/svc_prevent.jpg"
    },
    {
      id: "svc_pharmacy",
      title: "Prescription Support",
      subtitle: "Simple medication flow",
      bullets: ["E-prescriptions", "Refill reminders", "Guidance & counseling"],
      cta: "Get Support",
      image: "/assets/images/svc_pharmacy.jpg"
    },
    {
      id: "svc_homecare",
      title: "Home Care",
      subtitle: "Care where you are",
      bullets: ["Nursing visits", "Physio support", "Post-op follow-ups"],
      cta: "Request Home Care",
      image: "/assets/images/svc_homecare.jpg"
    }
  ],
  careers: [
    {
      id: "car_doctors",
      title: "Doctors & Specialists",
      subtitle: "Build your practice with support",
      bullets: ["Flexible schedules", "Modern diagnostics", "Collaborative teams"],
      cta: "Apply Now",
      image: "/assets/images/car_doctors.jpg"
    },
    {
      id: "car_nursing",
      title: "Nursing",
      subtitle: "Patient-first nursing culture",
      bullets: ["Clear SOPs", "Respectful workplace", "Growth paths"],
      cta: "Apply Now",
      image: "/assets/images/car_nursing.jpg"
    },
    {
      id: "car_admin",
      title: "Front Desk / Admin",
      subtitle: "Run smooth patient experiences",
      bullets: ["Patient coordination", "Billing support", "Operations help"],
      cta: "Apply Now",
      image: "/assets/images/car_admin.jpg"
    },
    {
      id: "car_labtech",
      title: "Lab Technician",
      subtitle: "Quality testing, real impact",
      bullets: ["Process discipline", "Accuracy focus", "Team support"],
      cta: "Apply Now",
      image: "/assets/images/car_labtech.jpg"
    },
    {
      id: "car_radiology",
      title: "Radiology Technician",
      subtitle: "Work with modern imaging",
      bullets: ["Safety standards", "Fast workflows", "Expert supervision"],
      cta: "Apply Now",
      image: "/assets/images/car_radiology.jpg"
    },
    {
      id: "car_intern",
      title: "Internships / Training",
      subtitle: "Learn in a calm, high-standard clinic",
      bullets: ["Mentorship", "Hands-on exposure", "Clear evaluation"],
      cta: "Apply Now",
      image: "/assets/images/car_intern.jpg"
    }
  ]
};
