import { Language } from "@/types/project";

export const dictionary: Record<
  Language,
  {
    nav: {
      dashboard: string;
      features: string;
      howItWorks: string;
      sampleBrief: string;
      startBuilding: string;
      signIn: string;
      signOut: string;
      aiSettings: string;
    };
    hero: {
      badge: string;
      headline: string;
      subheadline: string;
      primaryCta: string;
      secondaryCta: string;
      promiseLabel: string;
      promiseText: string;
    };
    dashboard: {
      welcome: string;
      subtitle: string;
      createNew: string;
      quickTemplates: string;
      recentProjects: string;
      progress: string;
      lastEdited: string;
      status: string;
      openWorkspace: string;
      viewBrief: string;
      duplicate: string;
      delete: string;
      noProjects: string;
    };
    workspace: {
      overview: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      step7: string;
      step8: string;
      step9: string;
      step10: string;
      autosaved: string;
      saving: string;
      generateWithAi: string;
      regenerateWithAi: string;
      saveProgress: string;
      nextStep: string;
      prevStep: string;
      judgeScoreTitle: string;
      judgeScoreSubtitle: string;
      weakestCategory: string;
      improvements: string;
      scoreHistory: string;
    };
  }
> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      features: "Features",
      howItWorks: "10-Step Workflow",
      sampleBrief: "Sample Brief",
      startBuilding: "Start Building Your Brief",
      signIn: "Sign In",
      signOut: "Sign Out",
      aiSettings: "AI Engine Config",
    },
    hero: {
      badge: "AI Product Strategist & Hackathon Planning Workspace • V1.0",
      headline: "From Hackathon Theme to Winning Project Strategy.",
      subheadline:
        "Validate problems, design solutions, align with judges, and generate an execution-ready project brief with AI.",
      primaryCta: "Start Building Your Brief",
      secondaryCta: "Explore Features",
      promiseLabel: "Core Product Promise",
      promiseText:
        "Turn your hackathon theme into a validated, technically feasible, judge-aligned project plan.",
    },
    dashboard: {
      welcome: "Hackathon Strategy Workspace",
      subtitle:
        "Manage your competition briefs, track judge readiness scores, and export pitch-ready A4 PDFs.",
      createNew: "Create New Project",
      quickTemplates: "Quick Start from Competition Preset",
      recentProjects: "Your Projects",
      progress: "Completion Progress",
      lastEdited: "Last edited",
      status: "Status",
      openWorkspace: "Open Workspace",
      viewBrief: "Final Brief & PDF",
      duplicate: "Duplicate",
      delete: "Delete",
      noProjects: "No hackathon projects yet. Create your first project above!",
    },
    workspace: {
      overview: "Project Overview",
      step1: "1. Theme Analyzer",
      step2: "2. Judge Criteria",
      step3: "3. Problem Discovery",
      step4: "4. Problem Validation",
      step5: "5. Solution Generator",
      step6: "6. Product Design",
      step7: "7. Technical Architecture",
      step8: "8. Development Timeline",
      step9: "9. Competition Deliverables",
      step10: "10. Final Brief & PDF",
      autosaved: "All changes saved",
      saving: "Saving...",
      generateWithAi: "Generate with AI Strategist",
      regenerateWithAi: "Regenerate Analysis",
      saveProgress: "Save Step",
      nextStep: "Next Step",
      prevStep: "Previous",
      judgeScoreTitle: "Judge Score Engine",
      judgeScoreSubtitle: "AI Estimated Competition Readiness Score",
      weakestCategory: "Weakest Category",
      improvements: "Actionable Improvement Suggestions",
      scoreHistory: "Score Progression History",
    },
  },
  id: {
    nav: {
      dashboard: "Dasbor",
      features: "Fitur Utama",
      howItWorks: "Alur 10 Langkah",
      sampleBrief: "Contoh Brief",
      startBuilding: "Mulai Buat Brief Anda",
      signIn: "Masuk",
      signOut: "Keluar",
      aiSettings: "Konfigurasi AI",
    },
    hero: {
      badge: "AI Product Strategist & Ruang Kerja Perencanaan Hackathon • V1.0",
      headline: "From Hackathon Theme to Winning Project Strategy.",
      subheadline:
        "Validasi masalah, rancang solusi, selaraskan dengan kriteria juri, dan hasilkan dokumen project brief siap eksekusi dengan AI.",
      primaryCta: "Start Building Your Brief",
      secondaryCta: "Explore Features",
      promiseLabel: "Janji Utama Produk",
      promiseText:
        "Ubah tema hackathon Anda menjadi rencana proyek yang tervalidasi, layak secara teknis, dan selaras dengan penilaian juri.",
    },
    dashboard: {
      welcome: "Ruang Kerja Strategi Hackathon",
      subtitle:
        "Kelola project brief kompetisi Anda, pantau skor kesiapan juri, dan ekspor PDF A4 siap presentasi.",
      createNew: "Buat Proyek Baru",
      quickTemplates: "Mulai Cepat dari Preset Kompetisi",
      recentProjects: "Proyek Anda",
      progress: "Progres Penyelesaian",
      lastEdited: "Terakhir diedit",
      status: "Status",
      openWorkspace: "Buka Workspace",
      viewBrief: "Brief Akhir & PDF",
      duplicate: "Duplikat",
      delete: "Hapus",
      noProjects: "Belum ada proyek hackathon. Buat proyek pertama Anda di atas!",
    },
    workspace: {
      overview: "Ringkasan Proyek",
      step1: "1. Analisis Tema",
      step2: "2. Kriteria Juri",
      step3: "3. Penemuan Masalah",
      step4: "4. Validasi Bukti",
      step5: "5. Generator Solusi",
      step6: "6. Desain Produk",
      step7: "7. Arsitektur Teknis",
      step8: "8. Jadwal Pengembangan",
      step9: "9. Deliverable Kompetisi",
      step10: "10. Brief Akhir & PDF",
      autosaved: "Semua perubahan tersimpan",
      saving: "Menyimpan...",
      generateWithAi: "Hasilkan dengan AI Strategist",
      regenerateWithAi: "Regenerasi Analisis",
      saveProgress: "Simpan Langkah",
      nextStep: "Langkah Berikutnya",
      prevStep: "Sebelumnya",
      judgeScoreTitle: "Mesin Skor Juri",
      judgeScoreSubtitle: "AI Estimated Competition Readiness Score",
      weakestCategory: "Kategori Terlemah",
      improvements: "Saran Perbaikan Terukur",
      scoreHistory: "Riwayat Perkembangan Skor",
    },
  },
};

