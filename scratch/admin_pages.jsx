function EventsPage({
  onLogout,
  onNavigate,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
  eventCategoryFilter = "All",
  setEventCategoryFilter,
}) {
  const [eventStep, setEventStep] = useState(1);

    const [eventForm, setEventForm] = useState({
    eventName: "",
    vertical: "Management",
    idType: "",
    date: "",
    time: "",
    program: "",
    venue: "",
    chiefGuest: "",
    guestOfHonor: "",
    facultySpeaker: "",
    banner: "",
    invitation: "",

    agendaItems: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],

    chiefGuestId: "",
    guestOfHonorId: "",
    facultySpeakerId: "",
    zoneNationalPerson: "",
    eventOverview: "",
    eventGallery: [],
    secretaryName: "",
    secretarySignature: "",
    secretaryPerson: "Secretary",

    managementAgenda: {
  officeSecretary: "",
  officeRecipient: "",
  noticeMeetingName: "",
  noticeDateTime: "",
  noticeVenue: "",
  hostInfo: "",

  item1: "",
  item2: "",
  item3: "",
  item4: "",
  item5: "",
  item6: "",
  item7Main: "",
  item7MovedBy: "",
  item7SecondedBy: "",
  item8Main: "",
  item8MovedBy: "",
  item8SecondedBy: "",
  item9: "",
  item10: "",
  item11: "",
  item12: "",
  item13: "",
  item14: "",
  item15: "",
  item16: "",
 otherSubjects: [],
  item17: "",
  item18: "",
  item19: "",
  item20: "",
  item21: "",
},
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [invitationPreview, setInvitationPreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const verticalOptions = [
    "Management",
    "Training",
    "Business",
    "Community Development",
    "Public Relationship & Marketing",
    "Growth & Development",
    "Internationalism",
    "Junior Jaycee",
    "Lady Jaycee",
  ];

  const agendaLabels = [
    "Meeting call to order",
    "JCI Creed",
    "Welcome Address",
    "Recognition",
    "Event chairman",
    "Introduction of Faculty",
    "Chief Guest Introduction",
    "Chief Guest address",
    "Floor Handed over to Faculty",
    "Floor Handed over to the Chair",
    "Feedback",
    "Pleasantries",
    "Announcements & Vote of Thanks",
    "Adjournment",
  ];

    const managementIdTypeOptions = ["LGB", "GB", "AGB"];

  const handleManagementAgendaChange = (key, value) => {
    setEventForm((prev) => ({
      ...prev,
      managementAgenda: {
        ...prev.managementAgenda,
        [key]: value,
      },
    }));
  };

  const addOtherSubjectField = () => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: [
        ...(prev.managementAgenda.otherSubjects || []),
        "",
      ],
    },
  }));
};

const updateOtherSubjectField = (index, value) => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: (prev.managementAgenda.otherSubjects || []).map((item, i) =>
        i === index ? value : item
      ),
    },
  }));
};

const removeOtherSubjectField = (index) => {
  setEventForm((prev) => ({
    ...prev,
    managementAgenda: {
      ...prev.managementAgenda,
      otherSubjects: (prev.managementAgenda.otherSubjects || []).filter(
        (_, i) => i !== index
      ),
    },
  }));
};

  const isEventCompleted = (event) => {
  if (!event?.date || !event?.time) return false;
  const eventDateTime = new Date(`${event.date}T${event.time}`);
  return new Date() > eventDateTime;
};

  const handleEventChange = (key, value) => {
    setEventForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAgendaChange = (index, value) => {
    setEventForm((prev) => ({
      ...prev,
      agendaItems: prev.agendaItems.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const goToEventStep2 = () => {
    if (
      !eventForm.eventName.trim() ||
      !eventForm.vertical.trim() ||
      !eventForm.date.trim() ||
      !eventForm.time.trim() ||
      !eventForm.program.trim() ||
      !eventForm.venue.trim()
    ) {
      alert("Please fill all Event Details.");
      return;
    }

    if (eventForm.vertical === "Management" && !eventForm.idType.trim()) {
      alert("Please select ID Type.");
      return;
    }

    setEventStep(2);
  };


  const backToEventStep1 = () => {
    setEventStep(1);
  };

  const goToEventStep3 = () => {
    if (!eventForm.secretaryName.trim()) {
      alert("Please enter secretary name.");
      return;
    }
    setEventStep(3);
  };

  const backToEventStep2 = () => {
    setEventStep(2);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 1920 || img.height !== 1080) {
        alert("Event Banner must be exactly 1920 × 1080 pixels.");
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setEventForm((prev) => ({ ...prev, banner: reader.result }));
        setBannerPreview(reader.result);
        URL.revokeObjectURL(objectUrl);
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  };

  const handleInvitationUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventForm((prev) => ({ ...prev, invitation: reader.result }));
      setInvitationPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEventForm((prev) => ({ ...prev, secretarySignature: reader.result }));
      setSignaturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEventGalleryUpload = async (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const converted = await Promise.all(
    files.slice(0, 6).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

  setEventForm((prev) => ({
    ...prev,
    eventGallery: converted,
  }));
};

   const eventCards = [
    {
      id: 1,
      title: "Annual Strategy Session",
      eventName: "Annual Strategy Session",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      status: "Completed",
      statusClass: "bg-emerald-100 text-emerald-700",
      tag: "Management",
      tagClass: "bg-[#eef2ff] text-[#5b3df5]",
      meta: "Madurai • 10:00 AM • Apr 10, 2026",
      vertical: "Management",
      date: "2026-04-10",
      time: "10:00",
      program: "Annual Strategy Session",
      venue: "Madurai",
      chiefGuest: "Mr. Senthil Kumar",
      guestOfHonor: "Mr. Rajesh Babu",
      chiefGuestId: "CG-1001",
      guestOfHonorId: "GH-1002",
      facultySpeaker: "Mr. Arun Prakash",
      facultySpeakerId: "FS-1003",
      zoneNationalPerson: "Zone President",
      eventOverview:
        "A strategic leadership meeting focused on annual goals, membership planning, chapter growth, and executive alignment for the upcoming cycle.",
      eventGallery: [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      ],
    },
 {
  id: 2,
  title: "Leadership Excellence Program",
  eventName: "Leadership Excellence Program",
  image:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  status: "Completed",
  statusClass: "bg-emerald-100 text-emerald-700",
  tag: "Training",
  tagClass: "bg-[#eef2ff] text-[#5b3df5]",
  meta: "Chennai • 02:30 PM • Apr 05, 2026",
  vertical: "Training",
  date: "2026-04-05",
  time: "14:30",
  program: "Leadership Excellence Program",
  venue: "Chennai",
  chiefGuest: "Dr. Karthik Raman",
  guestOfHonor: "Ms. Priya Devi",
  chiefGuestId: "CG-2001",
  guestOfHonorId: "GH-2002",
  facultySpeaker: "Dr. Elena Vance",
  facultySpeakerId: "FS-2003",
  zoneNationalPerson: "National Trainer",
  eventOverview:
    "An intensive workshop designed to build leadership confidence, public speaking, decision-making, and team management skills among members.",
  eventGallery: [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
  ],
},
    {
      id: 3,
      title: "MSME Connect Program",
      eventName: "MSME Connect Program",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      status: "Upcoming",
      statusClass: "bg-sky-100 text-sky-700",
      tag: "Business",
      tagClass: "bg-[#eef2ff] text-[#5b3df5]",
      meta: "Coimbatore • 11:30 AM • May 06, 2026",
      vertical: "Business",
      date: "2026-05-06",
      time: "11:30",
      program: "MSME Connect Program",
      venue: "Coimbatore",
      chiefGuest: "Mr. Mohan Raj",
      guestOfHonor: "Mrs. Keerthana",
      chiefGuestId: "CG-3001",
      guestOfHonorId: "GH-3002",
      facultySpeaker: "Ms. Priya Raman",
      facultySpeakerId: "FS-3003",
      zoneNationalPerson: "National Business Chairman",
      eventOverview:
        "A business networking summit connecting entrepreneurs, startups, and industry leaders to explore partnerships and local enterprise growth.",
      eventGallery: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      ],
    },
  ];
  const filteredCards =
    eventCategoryFilter === "All" || !eventCategoryFilter
      ? eventCards
      : eventCards.filter(
          (card) =>
            (card.tag || "").toUpperCase() === eventCategoryFilter.toUpperCase()
        );

  return (
    <div className="h-screen overflow-hidden bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex h-screen overflow-hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:px-5 sm:py-6`}
        >
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => {
                    onNavigate("members");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => {
                    onNavigate("Memberclassification");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                  active={activePage === "events"}
                  onClick={() => {
                    onNavigate("events");
                    setMobileMenuOpen(false);
                  }}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
                  }}
                />
                <SettingsToggleBlock
                  activePage={activePage}
                  onNavigate={(page) => {
                    onNavigate(page);
                    setMobileMenuOpen(false);
                  }}
                  showSettingsPage={showSettingsPage}
                  setShowSettingsPage={setShowSettingsPage}
                />
              </nav>
            </div>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="mt-auto flex h-[50px] w-full items-center justify-center rounded-full bg-[#ff1a12] text-[14px] font-semibold text-white shadow-[0_20px_30px_rgba(255,26,18,0.22)] sm:h-[56px] sm:text-[16px]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="h-screen flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-7 xl:px-8">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[1.8rem] font-bold tracking-[-0.05em] text-[#1f2430] sm:text-[2rem] md:text-[2.25rem]">
                  Event Planning
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex h-[44px] min-w-[240px] flex-1 items-center gap-2 rounded-full bg-[#f4f5f8] px-3 ring-1 ring-[#eceff4] sm:h-[48px] sm:gap-3 sm:px-4">
                  <Search className="h-3.5 w-3.5 text-[#9aa2b0] sm:h-4 sm:w-4" />
                  <input
                    className="w-full bg-transparent text-[12px] text-[#48505f] outline-none placeholder:text-[#b0b6c2] sm:text-[13px] md:text-[14px]"
                    placeholder="Search events or guests..."
                  />
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#636b7b] shadow-sm ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:h-12 sm:w-12">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5b3df5] sm:right-3.5 sm:top-3.5"></span>
                  </button>

                <button
  type="button"
  onClick={() => onNavigate("settings")}
  className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-[0_10px_24px_rgba(25,30,60,0.06)] ring-1 ring-[#eceef4] transition hover:bg-[#fafbff] sm:px-5 sm:py-2"
>
  <img
    src={saran}
    alt="Sarankumar R"
    className="h-8 w-8 rounded-full border border-[#f0f2f5] object-cover sm:h-10 sm:w-10"
  />
  <span className="text-[14px] font-bold text-[#1f2430] sm:text-[16px]">
    Sarankumar R
  </span>
</button>

                  
                </div>
              </div>
            </div>

            {eventStep === 1 && (
              <>
                <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
                      1. Event Details
                    </h2>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Name
                      </label>
                      <input
                        type="text"
                        value={eventForm.eventName}
                        onChange={(e) =>
                          handleEventChange("eventName", e.target.value)
                        }
                        placeholder="Enter event name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Vertical
                      </label>
                      <select
                        value={eventForm.vertical}
                        onChange={(e) =>
                          handleEventChange("vertical", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      >
                        {verticalOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>


{eventForm.vertical === "Management" && (
  <div>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      ID Type
    </label>
    <select
      value={eventForm.idType}
      onChange={(e) => handleEventChange("idType", e.target.value)}
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    >
      <option value="">Select ID Type</option>
      {managementIdTypeOptions.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
)}



                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Date
                      </label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) =>
                          handleEventChange("date", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Time
                      </label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) =>
                          handleEventChange("time", e.target.value)
                        }
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Program
                      </label>
                      <input
                        type="text"
                        value={eventForm.program}
                        onChange={(e) =>
                          handleEventChange("program", e.target.value)
                        }
                        placeholder="Enter program name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={eventForm.venue}
                        onChange={(e) =>
                          handleEventChange("venue", e.target.value)
                        }
                        placeholder="Grand Hyatt or Zoom Link"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Chief Guest
                      </label>
                      <input
                        type="text"
                        value={eventForm.chiefGuest}
                        onChange={(e) =>
                          handleEventChange("chiefGuest", e.target.value)
                        }
                        placeholder="Enter chief guest name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Guest of Honor
                      </label>
                      <input
                        type="text"
                        value={eventForm.guestOfHonor}
                        onChange={(e) =>
                          handleEventChange("guestOfHonor", e.target.value)
                        }
                        placeholder="Enter guest of honor name"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Faculty / Keynote Speaker
                      </label>
                      <input
                        type="text"
                        value={eventForm.facultySpeaker}
                        onChange={(e) =>
                          handleEventChange("facultySpeaker", e.target.value)
                        }
                        placeholder="Enter faculty or keynote speaker"
                        className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      />
                    </div>





<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Chief Guest ID
  </label>
  <input
    type="text"
    value={eventForm.chiefGuestId}
    onChange={(e) => handleEventChange("chiefGuestId", e.target.value)}
    placeholder="Enter chief guest ID number"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Guest of Honor ID
  </label>
  <input
    type="text"
    value={eventForm.guestOfHonorId}
    onChange={(e) => handleEventChange("guestOfHonorId", e.target.value)}
    placeholder="Enter guest of honor ID number"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>


<div>
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Zone / National Person
  </label>
  <input
    type="text"
    value={eventForm.zoneNationalPerson}
    onChange={(e) => handleEventChange("zoneNationalPerson", e.target.value)}
    placeholder="Enter zone or national person"
    className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

<div className="md:col-span-2">
  <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
    Event Overview
  </label>
  <textarea
    value={eventForm.eventOverview}
    onChange={(e) => handleEventChange("eventOverview", e.target.value)}
    placeholder="Enter event overview"
    rows={4}
    className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
  />
</div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Banner
                      </label>

                      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-[#5b3df5]">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={handleBannerUpload}
                        />

                        {bannerPreview ? (
                          <img
                            src={bannerPreview}
                            alt="Event Banner Preview"
                            className="max-h-[260px] w-full rounded-[20px] object-cover"
                          />
                        ) : (
                          <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                              <Upload className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                              Upload Event Banner
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              Exactly 1920 × 1080 px
                            </p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
                        Event Invitation
                      </label>

                      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-8 text-center transition hover:border-[#5b3df5]">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          className="hidden"
                          onChange={handleInvitationUpload}
                        />

                        {invitationPreview ? (
                          <img
                            src={invitationPreview}
                            alt="Event Invitation Preview"
                            className="max-h-[260px] w-full rounded-[20px] object-contain"
                          />
                        ) : (
                          <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                              <Upload className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                              Upload Event Invitation
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              Portrait format
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={goToEventStep2}
                    className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
                  >
                    Next
                  </button>
                </div>

                <section className="mt-6 sm:mt-7 md:mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#1f2430] sm:text-[1.8rem] md:text-[2rem]">
                          Active Schedule
                        </h2>
                        {eventCategoryFilter !== "All" && (
                          <button
                            onClick={() => setEventCategoryFilter("All")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#f1edff] px-3 py-1 text-[11px] font-bold text-[#5b3df5] transition hover:bg-[#e6e0ff]"
                          >
                            {eventCategoryFilter}{" "}
                            <span className="text-[14px]">×</span>
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-[12px] text-[#8b92a1] sm:text-[13px] md:text-[14px]">
                        Manage ongoing and upcoming events in your directory.
                      </p>
                    </div>

                    <div className="inline-flex rounded-full bg-[#f3f4f6] p-1 ring-1 ring-[#ebeef3]">
                      <button className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1f2430] shadow-sm sm:px-4 sm:py-2 sm:text-[12px]">
                        Grid
                      </button>
                      <button className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#8b92a1] sm:px-4 sm:py-2 sm:text-[12px]">
                        Timeline
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                   {filteredCards.map((card) => (
  <div
    key={card.id}
    onClick={() => onNavigate("eventDetails", "All", card)}
    className="overflow-hidden rounded-[26px] bg-white shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3] cursor-pointer"
  >
    <div className="relative">
      <img
        src={card.image}
        alt={card.title}
        className="h-[150px] w-full object-cover sm:h-[160px] md:h-[180px]"
      />
      <div className="absolute left-3 top-3 flex gap-2 sm:left-4 sm:top-4">
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] sm:px-3 sm:py-1 sm:text-[10px] ${card.statusClass}`}
        >
          {card.status}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] sm:px-3 sm:py-1 sm:text-[10px] ${card.tagClass}`}
        >
          {card.tag}
        </span>
      </div>
    </div>

    <div className="p-4 sm:p-5">
      <h3 className="text-[1.15rem] font-bold leading-7 tracking-[-0.03em] text-[#1f2430] sm:text-[1.25rem] md:text-[1.35rem]">
        {card.title}
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6f7787] sm:gap-2 sm:text-[12px] md:text-[13px]">
        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {card.meta}
      </p>


      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 sm:mt-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("eventDetails", "All", card);
          }}
          className="rounded-full border border-[#d7dbe4] bg-white px-4 py-2 text-[12px] font-semibold text-[#666f80] hover:bg-gray-50"
        >
          View Event
        </button>

        <div className="flex items-center gap-2">
          {isEventCompleted(card) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("eventReport", "All", card);
              }}
              className="rounded-full bg-[#0f172a] px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:opacity-90"
            >
              Event Report
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("eventDetails", "All", card);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f6f8] text-[#4f5665] sm:h-9 sm:w-9 md:h-10 md:w-10"
          >
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

    </div>
  </div>
))}
                  </div>


                </section>
              </>
            )}

            {eventStep === 2 && (
              <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
                    2. Agenda Details
                  </h2>
                </div>

                <p className="mt-2 text-[13px] text-[#6b7280] sm:text-[14px]">
  {eventForm.vertical === "Management"
    ? `Management Agenda • ID Type: ${eventForm.idType || "Not selected"}`
    : "Fill agenda details for the selected event."}
</p>

               <div className="grid gap-5 md:grid-cols-2">
  {eventForm.vertical === "Management" ? (
    <>


      <div className="md:col-span-2 rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-6 sm:p-8">
  <h3 className="text-[1.6rem] font-bold tracking-[-0.03em] text-[#111827]">
    {eventForm.idType || "LGB"} AGENDA
  </h3>

  <div className="mt-8 space-y-3 text-[15px] leading-8 text-[#111827] sm:text-[16px]">
    <div className="flex flex-wrap items-center gap-2">
      <span>LO Governing Board Meeting Information from the office of the Secretary :</span>
      <input
        type="text"
        value={eventForm.managementAgenda.officeSecretary || ""}
        onChange={(e) =>
          handleManagementAgendaChange("officeSecretary", e.target.value)
        }
        placeholder="Enter secretary name"
        className="min-w-[220px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>To JFS/ JCI PPP/ JCI.Sen/ JFP/ JFM/ Jc.HGF./</span>
      <input
        type="text"
        value={eventForm.managementAgenda.officeRecipient || ""}
        onChange={(e) =>
          handleManagementAgendaChange("officeRecipient", e.target.value)
        }
        placeholder="Enter recipient name"
        className="min-w-[220px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>Notice is hereby given that</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeMeetingName || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeMeetingName", e.target.value)
        }
        placeholder="Enter meeting title"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>will be on</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeDateTime || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeDateTime", e.target.value)
        }
        placeholder="Enter date & time"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
      <span>at</span>
      <input
        type="text"
        value={eventForm.managementAgenda.noticeVenue || ""}
        onChange={(e) =>
          handleManagementAgendaChange("noticeVenue", e.target.value)
        }
        placeholder="Enter venue"
        className="min-w-[260px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span>Host :</span>
      <input
        type="text"
        value={eventForm.managementAgenda.hostInfo || ""}
        onChange={(e) =>
          handleManagementAgendaChange("hostInfo", e.target.value)
        }
        placeholder="Enter host details"
        className="min-w-[320px] flex-1 border-b-2 border-red-400 bg-transparent px-1 py-1 font-semibold text-red-600 outline-none"
      />
    </div>
  </div>
</div>


      {[
  ["item1", "1. Meeting Call to Order [1 Min]"],
  ["item2", "2. JCI Creed [1 Min]"],
  ["item3", "3. Welcome Address [2 Min]"],
  ["item4", "4. Recognitions [2 Min]"],
  ["item5", "5. Roll Call [2 Min]"],
  ["item6", "6. Establishment of Quorum [1 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}


      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          7. Adoption of Agenda [5 Min]
        </label>
        <textarea
          value={eventForm.managementAgenda.item7Main}
          onChange={(e) =>
            handleManagementAgendaChange("item7Main", e.target.value)
          }
          placeholder="Text Box Big"
          rows={4}
          className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={eventForm.managementAgenda.item7MovedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item7MovedBy", e.target.value)
            }
            placeholder="Moved By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
          <input
            type="text"
            value={eventForm.managementAgenda.item7SecondedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item7SecondedBy", e.target.value)
            }
            placeholder="Seconded By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          8. Minutes of Previous Meeting [5 Min]
        </label>
        <textarea
          value={eventForm.managementAgenda.item8Main}
          onChange={(e) =>
            handleManagementAgendaChange("item8Main", e.target.value)
          }
          placeholder="Text Box Big"
          rows={4}
          className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={eventForm.managementAgenda.item8MovedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item8MovedBy", e.target.value)
            }
            placeholder="Moved By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
          <input
            type="text"
            value={eventForm.managementAgenda.item8SecondedBy}
            onChange={(e) =>
              handleManagementAgendaChange("item8SecondedBy", e.target.value)
            }
            placeholder="Seconded By"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />
        </div>
      </div>


       {[
  ["item9", "9. Matters arising out of Minutes [8 Min]"],
  ["item10", "10. Zone & National Correspondence [2 Min]"],
  ["item11", "11. Reports of VP's Secretary"],
  ["item12", "12. Approval of New Application [5 Min]"],
  ["item13", "13. JCI India Subscription [2 Min]"],
  ["item14", "14. House Bulletin TALENT [5 Min]"],
  ["item15", "15. Vision 50 [2 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}

     <div className="md:col-span-2">
  <div className="mb-3 flex items-center justify-between">
    <label className="block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      16. Other Subjects for Discussion [30 Min]
    </label>

    <button
      type="button"
      onClick={addOtherSubjectField}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5b3df5] text-white shadow-[0_10px_20px_rgba(91,61,245,0.25)]"
    >
      +
    </button>
  </div>

 


  {(eventForm.managementAgenda.otherSubjects || []).length === 0 ? (
    <div className="rounded-2xl border border-dashed border-[#d7dbe4] bg-[#fafbff] px-4 py-6 text-[14px] text-[#7b8494]">
      No subjects added yet. Click + to add.
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2">
      {(eventForm.managementAgenda.otherSubjects || []).map((item, index) => (
        <div key={index} className="relative">
          <textarea
            value={item}
            onChange={(e) => updateOtherSubjectField(index, e.target.value)}
            placeholder={`Subject ${index + 1}`}
            rows={3}
            className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 pr-14 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
          />

          <button
            type="button"
            onClick={() => removeOtherSubjectField(index)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>
{[
  ["item17", "17. IPP's Address [2 Min]"],
  ["item18", "18. Programs for ensuring month [1 Min]"],
  ["item19", "19. Next LGB Meeting [1 Min]"],
  ["item20", "20. Announcements & Vote of Thanks [2 Min]"],
  ["item21", "21. Adjournment [1 Min]"],
].map(([key, label]) => (
  <div key={key}>
    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
      {label}
    </label>
    <input
      type="text"
      value={eventForm.managementAgenda[key]}
      onChange={(e) => handleManagementAgendaChange(key, e.target.value)}
      placeholder="Enter details"
      className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
    />
  </div>
))}

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Name of the Secretary
        </label>
        <input
          type="text"
          value={eventForm.secretaryName}
          onChange={(e) =>
            handleEventChange("secretaryName", e.target.value)
          }
          placeholder="Enter secretary name"
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Person : Secretary / Acting Secretary
        </label>
        <select
          value={eventForm.secretaryPerson}
          onChange={(e) =>
            handleEventChange("secretaryPerson", e.target.value)
          }
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        >
          <option value="Secretary">Secretary</option>
          <option value="Acting Secretary">Acting Secretary</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          Signature
        </label>

        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-6 text-center transition hover:border-[#5b3df5]">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleSignatureUpload}
          />

          {signaturePreview ? (
            <img
              src={signaturePreview}
              alt="Signature Preview"
              className="max-h-[100px] w-full rounded-[16px] object-contain"
            />
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                Upload Signature
              </p>
            </>
          )}
        </label>
      </div>
    </>
  ) : (
    <>
      {eventForm.agendaItems.map((item, index) => (
        <div key={index}>
          <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
            {index + 1}. {agendaLabels[index]}
          </label>

          <input
            type="text"
            value={item}
            onChange={(e) => handleAgendaChange(index, e.target.value)}
            placeholder="Enter details"
            className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none placeholder:text-[#b0b6c2] focus:border-[#5b3df5]"
          />
        </div>
      ))}

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          15. Name of the Secretary
        </label>
        <input
          type="text"
          value={eventForm.secretaryName}
          onChange={(e) =>
            handleEventChange("secretaryName", e.target.value)
          }
          placeholder="Enter secretary name"
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        />
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          16. Signature
        </label>

        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8dde8] bg-[#fbfcfe] px-6 py-6 text-center transition hover:border-[#5b3df5]">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleSignatureUpload}
          />

          {signaturePreview ? (
            <img
              src={signaturePreview}
              alt="Signature Preview"
              className="max-h-[100px] w-full rounded-[16px] object-contain"
            />
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f8] text-[#5f6778]">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#1f2430]">
                Upload Signature
              </p>
            </>
          )}
        </label>
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]">
          17. Person : Secretary / Acting Secretary
        </label>
        <select
          value={eventForm.secretaryPerson}
          onChange={(e) =>
            handleEventChange("secretaryPerson", e.target.value)
          }
          className="h-[54px] w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
        >
          <option value="Secretary">Secretary</option>
          <option value="Acting Secretary">Acting Secretary</option>
        </select>
      </div>
    </>
  )}
</div>



              <div className="mt-8 flex items-center justify-between gap-3">
  <button
    type="button"
    onClick={backToEventStep1}
    className="rounded-full border border-[#d9deea] bg-white px-8 py-3 text-[14px] font-semibold text-[#4b5563]"
  >
    Back
  </button>

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={goToEventStep3}
      className="rounded-full border border-[#5b3df5] bg-white px-8 py-3 text-[14px] font-semibold text-[#5b3df5]"
    >
      Preview
    </button>

    <button
      type="button"
      onClick={() => alert("Event saved successfully")}
      className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
    >
      Create Event
    </button>
  </div>
</div>

              </div>
            )}

       {eventStep === 3 && (
  <div className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_10px_30px_rgba(25,30,60,0.04)] ring-1 ring-[#eceff5] sm:p-6 md:p-8">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#1f2430] sm:text-[1.3rem]">
          3. Preview Details
        </h2>
        <p className="mt-2 text-[13px] text-[#6b7280] sm:text-[14px]">
          Review all event details before creating the event.
        </p>
      </div>
    </div>

    <div className="rounded-[28px] border border-[#e6eaf2] bg-[#fafbff] p-5 sm:p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Event Name
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.eventName || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Vertical
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.vertical || "Not added"}
          </div>
        </div>

        {eventForm.vertical === "Management" && (
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              ID Type
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
              {eventForm.idType || "Not added"}
            </div>
          </div>
        )}

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Date
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.date || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Time
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.time || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Program
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.program || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Venue
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.venue || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Chief Guest
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.chiefGuest || "Optional / Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Guest of Honor
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.guestOfHonor || "Optional / Not added"}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Faculty / Keynote Speaker
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.facultySpeaker || "Optional / Not added"}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Event Overview
          </p>
          <div className="mt-2 min-h-[120px] rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] leading-7 text-[#1f2430]">
            {eventForm.eventOverview || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Secretary Name
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.secretaryName || "Not added"}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
            Secretary Type
          </p>
          <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-4 text-[15px] font-semibold text-[#1f2430]">
            {eventForm.secretaryPerson || "Not added"}
          </div>
        </div>

        {eventForm.vertical === "Management" ? (
          <div className="md:col-span-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              Management Agenda Preview
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-5 text-[15px] leading-8 text-[#1f2430]">
              <p><span className="font-semibold">Agenda Type:</span> {eventForm.idType || "Not added"}</p>
              <p><span className="font-semibold">Office Secretary:</span> {eventForm.managementAgenda.officeSecretary || "Not added"}</p>
              <p><span className="font-semibold">Office Recipient:</span> {eventForm.managementAgenda.officeRecipient || "Not added"}</p>
              <p><span className="font-semibold">Meeting Name:</span> {eventForm.managementAgenda.noticeMeetingName || "Not added"}</p>
              <p><span className="font-semibold">Date & Time Text:</span> {eventForm.managementAgenda.noticeDateTime || "Not added"}</p>
              <p><span className="font-semibold">Venue Text:</span> {eventForm.managementAgenda.noticeVenue || "Not added"}</p>
              <p><span className="font-semibold">Host:</span> {eventForm.managementAgenda.hostInfo || "Not added"}</p>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7b8494]">
              Agenda Preview
            </p>
            <div className="mt-2 rounded-2xl border border-[#e6eaf2] bg-white px-4 py-5 text-[15px] leading-8 text-[#1f2430]">
              {eventForm.agendaItems.some((item) => item.trim()) ? (
                <ul className="space-y-2">
                  {eventForm.agendaItems.map((item, index) => (
                    <li key={index}>
                      <span className="font-semibold">{index + 1}. {agendaLabels[index]}:</span>{" "}
                      {item || "Not added"}
                    </li>
                  ))}
                </ul>
              ) : (
                "No agenda details added"
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={backToEventStep2}
        className="rounded-full border border-[#d9deea] bg-white px-8 py-3 text-[14px] font-semibold text-[#4b5563]"
      >
        Back
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEventStep(2)}
          className="rounded-full border border-[#5b3df5] bg-white px-8 py-3 text-[14px] font-semibold text-[#5b3df5]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => alert("Event saved successfully")}
          className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
        >
          Create Event
        </button>
      </div>
    </div>
  </div>
)}
            
          </div>
        </main>
      </div>
    </div>
  );
}

function EventDetailsPage({
  event,
  onNavigate,
  onLogout,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <button
          onClick={() => onNavigate("events")}
          className="rounded-full bg-[#5b3df5] px-6 py-3 text-white"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f4f5f7] text-[#1f2430]">
      <div className="flex h-screen overflow-hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-full bg-[#5b3df5] p-3 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] transform border-r border-[#edf0f5] bg-[#f7f9fc] px-4 py-5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:px-5 sm:py-6`}
        >
          <div className="flex h-full flex-col">
            <div>
              <SidebarBrand />

              <nav className="mt-8 space-y-1 sm:mt-10 sm:space-y-2">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={activePage === "dashboard"}
                  onClick={() => onNavigate("dashboard")}
                />
                <SidebarItem
                  icon={Users}
                  label="Members"
                  active={activePage === "members"}
                  onClick={() => onNavigate("members")}
                />
                <SidebarItem
                  icon={FolderKanban}
                  label={MEMBER_CLASSIFICATION_LABEL}
                  active={activePage === "Memberclassification"}
                  onClick={() => onNavigate("Memberclassification")}
                />
                <SidebarItem
                  icon={CalendarDays}
                  label="Events"
                 active={
  activePage === "events" ||
  activePage === "eventDetails" ||
  activePage === "eventReport"
}
                  onClick={() => onNavigate("events")}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics"
                  active={activePage === "analytics"}
                  onClick={() => onNavigate("analytics")}
                />
              </nav>

              <SettingsToggleBlock
                activePage={activePage}
                onNavigate={onNavigate}
                showSettingsPage={showSettingsPage}
                setShowSettingsPage={setShowSettingsPage}
              />
            </div>

            <button
              onClick={onLogout}
              className="mt-auto rounded-full bg-red-500 px-4 py-3 text-[14px] font-semibold text-white shadow-[0_15px_30px_rgba(239,68,68,0.28)]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f5f7fb] px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1400px]">
            <button
              onClick={() => onNavigate("events")}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#5b3df5] shadow-sm ring-1 ring-[#eceff5]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Events
            </button>

            <section className="overflow-hidden rounded-[34px] bg-white shadow-[0_20px_60px_rgba(25,30,60,0.08)] ring-1 ring-[#ebedf3]">
              <div className="relative h-[260px] w-full sm:h-[320px] lg:h-[420px]">
                <img
                  src={event.image || event.banner}
                  alt={event.title || event.eventName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172acc] via-[#0f172a66] to-transparent" />

                <div className="absolute bottom-8 left-6 right-6">
                  <h1 className="text-[2rem] font-bold tracking-[-0.05em] text-white sm:text-[2.5rem] lg:text-[3.25rem]">
                    {event.eventName || event.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-7 lg:p-8">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Name
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.eventName || event.title || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Vertical
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.vertical || event.tag || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Date
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.date || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Time
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.time || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Program
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.program || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Venue
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.venue || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Chief Guest
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.chiefGuest || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.chiefGuestId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Guest of Honor
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.guestOfHonor || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.guestOfHonorId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Faculty / Keynote Speaker
                    </p>
                    <p className="mt-2 text-[16px] font-semibold text-[#1f2430]">
                      {event.facultySpeaker || "Not added"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      ID: {event.facultySpeakerId || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Zone / National Person
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#1f2430]">
                      {event.zoneNationalPerson || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Overview
                    </p>
                    <p className="mt-3 text-[15px] leading-8 text-[#4f5666]">
                      {event.eventOverview || event.description || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eceff5] bg-[#fafbff] p-5 md:col-span-2 xl:col-span-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b92a1]">
                      Event Gallery
                    </p>

                    {event.eventGallery && event.eventGallery.length > 0 ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {event.eventGallery.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="h-[180px] w-full rounded-[22px] object-cover ring-1 ring-[#eceff5]"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-[15px] text-[#6b7280]">
                        No gallery images added
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function EventReportPage({
  event,
  onNavigate,
  onLogout,
  activePage,
  showSettingsPage,
  setShowSettingsPage,
}) {
  const [reportForm, setReportForm] = useState({
    eventName: "",
    vertical: "",
    date: "",
    time: "",
    program: "",
    venue: "",
    eventOverview: "",
    chiefGuestCount: "",
    guestOfHonorCount: "",
    facultyCount: "",
    lgbMembersCount: "",
    jcsCount: "",
    familyMembersCount: "",
    pastPresidentsCount: "",
    chiefGuestId: "",
    guestOfHonorId: "",
    facultyId: "",
    jacCount: "",
    nonJcCount: "",
    zoneNationalPersonCount: "",
    zoneNationalPersonId: "",
    totalCount: "",
    beneficiaryCount: "",
    description: "",
    problemIfAny: "",
    futureProgram: [""],
    submittedAt: "",
    reportImageGroup1: [],
    reportImageGroup2: [],
    reportImageGroup3: [],
    vicePresidentReport: "",
    month: "",
  });

  useEffect(() => {
    if (!event) return;

    setReportForm({
      eventName: event.eventName || "",
      vertical: event.vertical || "",
      date: event.date || "",
      time: event.time || "",
      program: event.program || "",
      venue: event.venue || "",
      eventOverview: event.report?.eventOverview || event.eventOverview || "",
      chiefGuestCount: event.report?.chiefGuestCount || "",
      guestOfHonorCount: event.report?.guestOfHonorCount || "",
      facultyCount: event.report?.facultyCount || "",
      lgbMembersCount: event.report?.lgbMembersCount || "",
      jcsCount: event.report?.jcsCount || "",
      familyMembersCount: event.report?.familyMembersCount || "",
      pastPresidentsCount: event.report?.pastPresidentsCount || "",
      chiefGuestId: event.report?.chiefGuestId || event.chiefGuestId || "",
      guestOfHonorId: event.report?.guestOfHonorId || event.guestOfHonorId || "",
      facultyId: event.report?.facultyId || event.facultySpeakerId || "",
      jacCount: event.report?.jacCount || "",
      nonJcCount: event.report?.nonJcCount || "",
      zoneNationalPersonCount: event.report?.zoneNationalPersonCount || "",
      zoneNationalPersonId: event.report?.zoneNationalPersonId || "",
      totalCount: event.report?.totalCount || "",
      reportImageGroup1: event.report?.reportImageGroup1 || [],
      reportImageGroup2: event.report?.reportImageGroup2 || [],
      reportImageGroup3: event.report?.reportImageGroup3 || [],
      beneficiaryCount: event.report?.beneficiaryCount || "",
      description: event.report?.description || "",
      problemIfAny: event.report?.problemIfAny || "",
      futureProgram:
        Array.isArray(event.report?.futureProgram) && event.report.futureProgram.length
          ? event.report.futureProgram
          : [""],
      submittedAt: event.report?.submittedAt || "",
      vicePresidentReport: event.report?.vicePresidentReport || "",
      month: event.report?.month || "",
    });
  }, [event]);

  if (!event) {
    return (
      <div className="p-8">
        <p>No event selected.</p>
        <button onClick={() => onNavigate("events")}>Back to Events</button>
      </div>
    );
  }

  const handleReportChange = (key, value) => {
    setReportForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFutureProgram = () => {
    setReportForm((prev) => ({
      ...prev,
      futureProgram: [...prev.futureProgram, ""],
    }));
  };

  const removeFutureProgram = (index) => {
    setReportForm((prev) => ({
      ...prev,
      futureProgram:
        prev.futureProgram.length === 1
          ? [""]
          : prev.futureProgram.filter((_, i) => i !== index),
    }));
  };

  const handleFutureProgramChange = (index, value) => {
    const updated = [...reportForm.futureProgram];
    updated[index] = value;

    setReportForm((prev) => ({
      ...prev,
      futureProgram: updated,
    }));
  };

  const convertFilesToBase64 = async (files) => {
    return await Promise.all(
      Array.from(files)
        .slice(0, 10)
        .map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
    );
  };

  const handleReportImageUpload = async (key, e) => {
    const files = e.target.files || [];
    if (!files.length) return;
    const converted = await convertFilesToBase64(files);
    setReportForm((prev) => ({
      ...prev,
      [key]: converted,
    }));
  };

  const handleSaveReport = () => {
    const updatedEvent = {
      ...event,
      report: {
        eventOverview: reportForm.eventOverview,
        chiefGuestCount: reportForm.chiefGuestCount,
        guestOfHonorCount: reportForm.guestOfHonorCount,
        facultyCount: reportForm.facultyCount,
        lgbMembersCount: reportForm.lgbMembersCount,
        jcsCount: reportForm.jcsCount,
        familyMembersCount: reportForm.familyMembersCount,
        pastPresidentsCount: reportForm.pastPresidentsCount,
        chiefGuestId: reportForm.chiefGuestId,
        guestOfHonorId: reportForm.guestOfHonorId,
        facultyId: reportForm.facultyId,
        jacCount: reportForm.jacCount,
        nonJcCount: reportForm.nonJcCount,
        zoneNationalPersonCount: reportForm.zoneNationalPersonCount,
        zoneNationalPersonId: reportForm.zoneNationalPersonId,
        totalCount: reportForm.totalCount,
        reportImageGroup1: reportForm.reportImageGroup1,
        reportImageGroup2: reportForm.reportImageGroup2,
        reportImageGroup3: reportForm.reportImageGroup3,
        beneficiaryCount: reportForm.beneficiaryCount,
        description: reportForm.description,
        problemIfAny: reportForm.problemIfAny,
        futureProgram: reportForm.futureProgram,
        submittedAt: reportForm.submittedAt,
        vicePresidentReport: reportForm.vicePresidentReport,
        month: reportForm.month,
      },
    };

    onNavigate("eventDetails", "All", updatedEvent);
  };

  const inputClass =
    "h-[52px] w-full rounded-2xl border border-[#e8ebf2] bg-white px-4 text-[14px] text-[#495160] outline-none";

  const labelClass =
    "mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-[#4b5563] sm:text-[13px]";

  const formatRichText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleRichTextInput = (field, e) => {
    handleReportChange(field, e.currentTarget.innerHTML);
  };

  const isManagement =
    (reportForm.vertical || "").trim().toLowerCase() === "management";

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1400px]">
          <button
            onClick={() => onNavigate("events")}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#5b3df5] shadow-sm ring-1 ring-[#eceff5]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Events
          </button>

          <section className="rounded-[30px] bg-white p-6 shadow-[0_8px_24px_rgba(25,30,60,0.04)] ring-1 ring-[#efeff3]">
            <h2 className="text-[1.8rem] font-bold tracking-[-0.04em] text-[#1f2430]">
              Event Reports
            </h2>

            {isManagement ? (
              <div className="mt-6 rounded-[24px] border border-[#e6eaf2] bg-[#fafbff] p-5 sm:p-6">
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Report of Vice President</label>
                    <input
                      value={reportForm.vicePresidentReport || ""}
                      onChange={(e) =>
                        handleReportChange("vicePresidentReport", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter report of vice president"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>For the Month</label>
                    <input
                      type="month"
                      value={reportForm.month}
                      onChange={(e) => handleReportChange("month", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Submitted at</label>
                    <input
                      value={reportForm.submittedAt}
                      onChange={(e) =>
                        handleReportChange("submittedAt", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter submitted place / submitted at"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Host</label>
                    <input
                      value={reportForm.eventOverview}
                      onChange={(e) =>
                        handleReportChange("eventOverview", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter host"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-[1.2rem] font-bold text-[#1f2430]">
                    Action Taken on Assignment
                  </h3>
                  <p className="mt-4 text-[15px] font-semibold text-[#1f2430]">
                    1. Event Details
                  </p>

                  <div className="mt-4 overflow-hidden rounded-[18px] border border-[#d9deea]">
                    <div className="grid grid-cols-[1fr_1fr] bg-[#f3f5fa] text-[13px] font-bold text-[#1f2430]">
                      <div className="border-r border-[#d9deea] px-4 py-3">
                        Particulars
                      </div>
                      <div className="px-4 py-3">Details</div>
                    </div>

                    {[
                      ["Event Name", reportForm.eventName],
                      ["Vertical", reportForm.vertical],
                      ["Date", reportForm.date],
                      ["Time", reportForm.time],
                      ["Program", reportForm.program],
                      ["Venue", reportForm.venue],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]"
                      >
                        <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                          {label}
                        </div>
                        <div className="px-4 py-3 text-[#4f5666]">
                          {value || "-"}
                        </div>
                      </div>
                    ))}

                    {[
                      ["Chief Guest", "chiefGuestCount"],
                      ["Guest of Honor", "guestOfHonorCount"],
                      ["Faculty / Keynote Speaker", "facultyCount"],
                      ["LGB Members", "lgbMembersCount"],
                      ["Jc's", "jcsCount"],
                      ["Family Members", "familyMembersCount"],
                      ["Past Presidents", "pastPresidentsCount"],
                      ["Chief Guest ID", "chiefGuestId"],
                      ["Guest of Honor ID", "guestOfHonorId"],
                      ["Faculty", "facultyId"],
                      ["JAC", "jacCount"],
                      ["Non-JC", "nonJcCount"],
                      ["Beneficiary", "beneficiaryCount"],
                      ["Total Attendance", "totalCount"],
                    ].map(([label, key]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]"
                      >
                        <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                          {label}
                        </div>
                        <div className="px-4 py-2">
                          <input
                            value={reportForm[key]}
                            onChange={(e) =>
                              handleReportChange(key, e.target.value)
                            }
                            className="w-full rounded-xl border border-[#e6eaf2] bg-white px-3 py-2 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                            placeholder="Enter details"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-[1fr_1fr] border-t border-[#d9deea] text-[14px]">
                      <div className="border-r border-[#d9deea] px-4 py-3 font-semibold text-[#1f2430]">
                        Description
                      </div>

                      <div className="px-4 py-2">
                        <div className="overflow-hidden rounded-xl border border-[#d9deea] bg-white">
                          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] px-3 py-2">
                            <select
                              className="rounded-md border border-[#d9deea] bg-white px-2 py-1 text-[13px] outline-none"
                              onChange={(e) =>
                                formatRichText("formatBlock", e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="">Normal</option>
                              <option value="H1">Heading 1</option>
                              <option value="H2">Heading 2</option>
                              <option value="P">Paragraph</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => formatRichText("bold")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] font-bold"
                            >
                              B
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("italic")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] italic"
                            >
                              I
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("underline")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] underline"
                            >
                              U
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                formatRichText("insertUnorderedList")
                              }
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              • List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("insertOrderedList")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              1. List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyLeft")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Left
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyCenter")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Center
                            </button>
                          </div>

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => handleRichTextInput("description", e)}
                            dangerouslySetInnerHTML={{
                              __html: reportForm.description || "",
                            }}
                            className="min-h-[140px] w-full px-4 py-3 text-[14px] text-[#1f2430] outline-none"
                            style={{ whiteSpace: "pre-wrap" }}
                          />

                          {!reportForm.description && (
                            <div className="pointer-events-none -mt-[132px] px-4 py-3 text-[14px] text-[#9ca3af]">
                              Text box, Bulletins
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Problem if any</label>
                    <textarea
                      value={reportForm.problemIfAny}
                      onChange={(e) =>
                        handleReportChange("problemIfAny", e.target.value)
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[#e6eaf2] bg-white px-4 py-3 text-[14px] text-[#1f2430] outline-none focus:border-[#5b3df5]"
                      placeholder="Text Box"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <label className={labelClass}>Future Program</label>

                      <button
                        type="button"
                        onClick={addFutureProgram}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5b3df5] text-white shadow"
                      >
                        +
                      </button>
                    </div>

                    <div className="space-y-4">
                      {reportForm.futureProgram.map((item, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-2xl border border-[#e6eaf2] bg-white"
                        >
                          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] px-3 py-2">
                            <select
                              className="rounded-md border border-[#d9deea] bg-white px-2 py-1 text-[13px] outline-none"
                              onChange={(e) =>
                                formatRichText("formatBlock", e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="">Normal</option>
                              <option value="H1">Heading 1</option>
                              <option value="H2">Heading 2</option>
                              <option value="P">Paragraph</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => formatRichText("bold")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] font-bold"
                            >
                              B
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("italic")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] italic"
                            >
                              I
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("underline")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px] underline"
                            >
                              U
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                formatRichText("insertUnorderedList")
                              }
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              • List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("insertOrderedList")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              1. List
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyLeft")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Left
                            </button>

                            <button
                              type="button"
                              onClick={() => formatRichText("justifyCenter")}
                              className="rounded-md border border-[#d9deea] px-2 py-1 text-[13px]"
                            >
                              Center
                            </button>
                          </div>

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) =>
                              handleFutureProgramChange(
                                index,
                                e.currentTarget.innerHTML
                              )
                            }
                            dangerouslySetInnerHTML={{ __html: item || "" }}
                            className="min-h-[120px] px-4 py-3 text-[14px] text-[#1f2430] outline-none"
                            style={{ whiteSpace: "pre-wrap" }}
                          />

                          {!item && (
                            <div className="pointer-events-none -mt-[112px] px-4 py-3 text-[14px] text-[#9ca3af]">
                              Enter future program details
                            </div>
                          )}

                          <div className="flex justify-end p-2">
                            <button
                              type="button"
                              onClick={() => removeFutureProgram(index)}
                              className="text-[12px] font-medium text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Event Name</label>
                  <input value={reportForm.eventName} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Vertical</label>
                  <input value={reportForm.vertical} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Date</label>
                  <input value={reportForm.date} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Time</label>
                  <input value={reportForm.time} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Program</label>
                  <input value={reportForm.program} readOnly className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Venue</label>
                  <input value={reportForm.venue} readOnly className={inputClass} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Event Overview</label>
                  <textarea
                    rows={5}
                    value={reportForm.eventOverview}
                    onChange={(e) => handleReportChange("eventOverview", e.target.value)}
                    className="w-full rounded-2xl border border-[#e8ebf2] bg-white px-4 py-3 text-[14px] text-[#495160] outline-none"
                  />
                </div>

                <div>
                  <label className={labelClass}>Chief Guest</label>
                  <input
                    value={reportForm.chiefGuestCount}
                    onChange={(e) => handleReportChange("chiefGuestCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Chief Guest ID</label>
                  <input
                    value={reportForm.chiefGuestId}
                    onChange={(e) => handleReportChange("chiefGuestId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Guest of Honor</label>
                  <input
                    value={reportForm.guestOfHonorCount}
                    onChange={(e) => handleReportChange("guestOfHonorCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Guest of Honor ID</label>
                  <input
                    value={reportForm.guestOfHonorId}
                    onChange={(e) => handleReportChange("guestOfHonorId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Faculty / Keynote Speaker</label>
                  <input
                    value={reportForm.facultyCount}
                    onChange={(e) => handleReportChange("facultyCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Faculty ID</label>
                  <input
                    value={reportForm.facultyId}
                    onChange={(e) => handleReportChange("facultyId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>LGB Members</label>
                  <input
                    value={reportForm.lgbMembersCount}
                    onChange={(e) => handleReportChange("lgbMembersCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>JC’s</label>
                  <input
                    value={reportForm.jcsCount}
                    onChange={(e) => handleReportChange("jcsCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Family Members</label>
                  <input
                    value={reportForm.familyMembersCount}
                    onChange={(e) => handleReportChange("familyMembersCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Past Presidents</label>
                  <input
                    value={reportForm.pastPresidentsCount}
                    onChange={(e) => handleReportChange("pastPresidentsCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>JAC</label>
                  <input
                    value={reportForm.jacCount}
                    onChange={(e) => handleReportChange("jacCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Non-JC</label>
                  <input
                    value={reportForm.nonJcCount}
                    onChange={(e) => handleReportChange("nonJcCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zone / National Person</label>
                  <input
                    value={reportForm.zoneNationalPersonCount}
                    onChange={(e) => handleReportChange("zoneNationalPersonCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zone / National Person ID</label>
                  <input
                    value={reportForm.zoneNationalPersonId}
                    onChange={(e) => handleReportChange("zoneNationalPersonId", e.target.value)}
                    className={inputClass}
                    placeholder="ID"
                  />
                </div>

                <div>
                  <label className={labelClass}>Total</label>
                  <input
                    value={reportForm.totalCount}
                    onChange={(e) => handleReportChange("totalCount", e.target.value)}
                    className={inputClass}
                    placeholder="Numerical"
                  />
                </div>

                <div className="md:col-span-2 grid gap-5 md:grid-cols-3">
                  {[["reportImageGroup1", "Event-1 Image"]].map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleReportImageUpload(key, e)}
                        className="block w-full text-[13px]"
                      />
                      <p className="mt-2 text-[12px] text-[#7b8494]">
                        Upload up to 10 images
                      </p>

                      {reportForm[key].length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {reportForm[key].map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${label} ${index + 1}`}
                              className="h-20 w-full rounded-xl object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveReport}
                className="rounded-full bg-gradient-to-r from-[#4e3ae9] to-[#6a42f5] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_14px_22px_rgba(78,58,233,0.22)]"
              >
                Save Event Report
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
