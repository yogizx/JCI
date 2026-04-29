import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import jciLogo from '../../assets/JCI Madurai Central.png';
import {
  Camera, Phone, Mail, MapPin, Edit3, Trash2, Plus, Download, Heart,
  Globe, Instagram, Linkedin, UserPlus, Award,
  Shield, FileText, Briefcase, CheckCircle, Save,
  MoreHorizontal, CreditCard, Pencil, Facebook, Twitter, Youtube, X, Image as ImageIcon, MapPin as MapIcon, Link as LinkIcon
} from 'lucide-react';

// --- Reusable Sub-components ---
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, actionIcon: Icon, actionText, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">{title}</h3>
    {actionText ? (
      <button onClick={onAction} className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:opacity-70 transition-all">
        <Plus size={13}/> {actionText}
      </button>
    ) : (
      Icon && <Icon size={16} className="text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" />
    )}
  </div>
);

const InputField = ({ label, value, onChange, disabled, type = 'text', placeholder }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder || label}
      className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
        disabled
          ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
          : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
      }`}
    />
  </div>
);

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', bloodGroup: '' });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialForm, setSocialForm] = useState({});

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (searchParams.get('changePassword') === '1') setShowPasswordModal(true);
  }, [searchParams]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/member/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMember(data.member);
        setChildren(data.member.profile.family?.children || []);
        localStorage.setItem('user', JSON.stringify(data.member));
        initForms(data.member);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const initForms = (m) => {
    const p = m.profile || {};
    setEditForm({
      name: m.name || '',
      phone: p.phone || '',
      dob: p.dob || '',
      bloodGroup: p.bloodGroup || '',
      profession: p.profession || '',
      address: p.address || '',
      city: p.city || '',
      state: p.state || '',
      pincode: p.pincode || '',
      businessName: p.business?.name || '',
      businessContactNo: p.business?.contactNo || '',
      businessAddress: p.business?.address || '',
      businessRole: p.businessRole || '',
      businessEmail: p.business?.email || '',
      maritalStatus: p.family?.maritalStatus || '',
      anniversary: p.family?.anniversary || '',
    });
    setSocialForm({
      website: p.social?.website || '',
      linkedin: p.social?.linkedin || '',
      instagram: p.social?.instagram || '',
      facebook: p.social?.facebook || '',
      twitter: p.social?.twitter || '',
      youtube: p.social?.youtube || '',
      customLinks: p.social?.customLinks || [],
    });
  };

  const handleUpdateProfile = async (updateData) => {
    setUpdateLoading(true);
    try {
      const res = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok) {
        setMember(data.member);
        setChildren(data.member.profile.family?.children || []);
        localStorage.setItem('user', JSON.stringify(data.member));
        initForms(data.member);
        setIsEditing(false);
        setShowSocialModal(false);
        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (err) {
      alert('Failed to update profile');
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  const saveProfileEdits = async () => {
    await handleUpdateProfile({
      name: editForm.name,
      profile: {
        phone: editForm.phone,
        dob: editForm.dob,
        bloodGroup: editForm.bloodGroup,
        profession: editForm.profession,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        pincode: editForm.pincode,
        businessRole: editForm.businessRole,
        business: {
          name: editForm.businessName,
          contactNo: editForm.businessContactNo,
          address: editForm.businessAddress,
          email: editForm.businessEmail,
        },
        family: {
          ...(member?.profile?.family || {}),
          maritalStatus: editForm.maritalStatus,
          anniversary: editForm.anniversary,
        },
        social: member?.profile?.social || {},
      }
    });
  };

  const saveSocialLinks = async () => {
    await handleUpdateProfile({
      profile: {
        ...(member?.profile || {}),
        social: {
          website: socialForm.website,
          linkedin: socialForm.linkedin,
          instagram: socialForm.instagram,
          facebook: socialForm.facebook,
          twitter: socialForm.twitter,
          youtube: socialForm.youtube,
          customLinks: socialForm.customLinks,
        }
      }
    });
  };

  const addChild = () => {
    if (children.length < 3) setShowModal(true);
    else alert('Maximum 3 children allowed.');
  };

  const saveChild = (e) => {
    e.preventDefault();
    if (children.length < 3) {
      const newChildren = [...children, { ...formData }];
      setChildren(newChildren);
      handleUpdateProfile({ profile: { family: { ...member.profile.family, children: newChildren } } });
      setShowModal(false);
      setFormData({ name: '', dob: '', bloodGroup: '' });
    }
  };

  const openPasswordModal = () => { setPasswordStatus({ type: '', message: '' }); setShowPasswordModal(true); };
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const next = new URLSearchParams(searchParams);
    next.delete('changePassword');
    setSearchParams(next);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Fill in all password fields.' }); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirm password must match.' }); return;
    }
    setPasswordLoading(true);
    setPasswordStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/member/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMember(data.member);
        localStorage.setItem('user', JSON.stringify(data.member));
        setPasswordStatus({ type: 'success', message: data.message || 'Password updated successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => closePasswordModal(), 900);
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'Unable to update the password right now.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400 font-medium">Loading profile...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!member) return <div className="p-10 text-center">No profile found.</div>;

  const { profile, memberId, name } = member;
  const social = profile.social || {};

  // Build QR content
  const qrData = JSON.stringify({
    name: name,
    memberId: memberId,
    phone: profile.phone,
    email: profile.email,
    category: member.membershipCategory,
    org: 'JCI Madurai Central',
  });

  const ef = editForm; // alias
  const isMarried = profile.family?.maritalStatus === 'Married';
  const isSalaried = member.memberSegment === 'Salaried';
  const overviewTitle = isSalaried ? 'Company Overview' : 'Business Overview';

  return (
    <div className="w-full max-w-full pb-10 overflow-x-hidden">

      {/* TOP: Profile Hero */}
      <Card className="mb-4">
        <div className="flex flex-col gap-6">
          {/* Avatar + Name Row */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={profile.profileImage || "https://img.freepik.com/premium-vector/avatar-man-short-hair-dark-skin_113065-517.jpg"}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                <Camera size={14} />
              </button>
            </div>

            {/* Name + Info + Buttons */}
            <div className="flex-1 min-w-0 w-full">
              {isEditing ? (
                <div className="mb-3">
                  <InputField label="Full Name" value={ef.name} onChange={e => setEditForm({...ef, name: e.target.value})} />
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-slate-800">{name}</h1>
                  <CheckCircle size={20} className="text-emerald-500" fill="currentColor" />
                </div>
              )}
              <p className="text-sm text-slate-400 mb-3 font-medium">JCI Member ID: <span className="text-blue-600 font-bold">{memberId}</span></p>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-2"><Phone size={14} className="text-blue-500" /><span>{profile.phone}</span></div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-blue-500" /><span className="break-all">{profile.email}</span></div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveProfileEdits}
                      disabled={updateLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-60"
                    >
                      <Save size={14} /> {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); initForms(member); }}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={openPasswordModal}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Change Password
                    </button>
                  </>
                )}
                {member.isTempPassword && (
                  <div className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl text-xs font-medium">
                    Temporary password active — please change it!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats + QR */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-between border-t border-slate-100 pt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-6 flex-1 w-full">
              {isEditing ? (
                <>
                  <InputField label="Date of Birth" type="date" value={ef.dob} onChange={e => setEditForm({...ef, dob: e.target.value})} />
                  <InputField label="Profession" value={ef.profession} onChange={e => setEditForm({...ef, profession: e.target.value})} />
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">Marital Status</label>
                    <select value={ef.maritalStatus} onChange={e => setEditForm({...ef, maritalStatus: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                      <option value="">Select</option>
                      {['Single','Married'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {ef.maritalStatus === 'Married' && (
                    <InputField label="Anniversary" type="date" value={ef.anniversary} onChange={e => setEditForm({...ef, anniversary: e.target.value})} />
                  )}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">Blood Group</label>
                    <select value={ef.bloodGroup} onChange={e => setEditForm({...ef, bloodGroup: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <StatItem label="Date of Birth" val={profile.dob || "Not set"} />
                  <StatItem label="Profession" val={profile.profession || "Not set"} />
                  <StatItem label="Marital Status" val={profile.family?.maritalStatus || "Not set"} />
                  {isMarried && (
                    <StatItem label="Anniversary" val={profile.family?.anniversary || "Not set"} />
                  )}
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Blood Group</p>
                    <p className="text-sm font-bold text-red-500 flex items-center gap-1.5">
                      <Heart size={14} fill="currentColor" /> {profile.bloodGroup || "Not set"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* QR Code */}
            <div className="shrink-0 flex flex-col items-center gap-3 bg-gradient-to-br from-slate-50 to-white p-4 rounded-3xl border border-slate-100 w-full sm:w-auto">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
                <QRCodeSVG
                  value={qrData}
                  size={80}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: jciLogo,
                    height: 18,
                    width: 18,
                    excavate: true,
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Digital Pass</p>
                <p className="text-[9px] text-slate-300 font-bold">SCAN TO VERIFY</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact + Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <SectionHeader title="Communication" actionIcon={MoreHorizontal} />
          <div className="space-y-3">
            <CommItem icon={<Phone size={14} className="text-blue-500" />} val={profile.phone} badge="Primary" />
            <CommItem icon={<Mail size={14} className="text-red-400" />} val={profile.email} />
          </div>
        </Card>

        <Card>
          <SectionHeader title="Residential Address" />
          {isEditing ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <InputField label="Address" value={ef.address} onChange={e => setEditForm({...ef, address: e.target.value})} />
              </div>
              <InputField label="City" value={ef.city} onChange={e => setEditForm({...ef, city: e.target.value})} />
              <InputField label="State" value={ef.state} onChange={e => setEditForm({...ef, state: e.target.value})} />
              <InputField label="Pincode" value={ef.pincode} onChange={e => setEditForm({...ef, pincode: e.target.value})} />
            </div>
          ) : (
            <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {profile.address || "No address added"}{profile.city ? `, ${profile.city}` : ''}{profile.state ? `, ${profile.state}` : ''}{profile.pincode ? ` - ${profile.pincode}` : ''}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Business Overview */}
      <Card className="mb-4">
        <SectionHeader title={overviewTitle} />
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField label={isSalaried ? "Company Name" : "Business Name"} value={ef.businessName} onChange={e => setEditForm({...ef, businessName: e.target.value})} />
            <InputField label={isSalaried ? "Designation" : "Business Role"} value={ef.businessRole} onChange={e => setEditForm({...ef, businessRole: e.target.value})} />
            {!isSalaried ? (
               <InputField label="Contact Number" value={ef.businessContactNo} onChange={e => setEditForm({...ef, businessContactNo: e.target.value})} />
            ) : (
               <InputField label="Official Email (Optional)" type="email" value={ef.businessEmail} onChange={e => setEditForm({...ef, businessEmail: e.target.value})} />
            )}
            <div className="sm:col-span-2">
              <InputField label={isSalaried ? "Location / Address" : "Business Address"} value={ef.businessAddress} onChange={e => setEditForm({...ef, businessAddress: e.target.value})} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatItem label={isSalaried ? "Company Name" : "Business Name"} val={profile.business?.name || "Not set"} />
            <StatItem label={isSalaried ? "Designation" : "Business Role"} val={profile.businessRole || "Not set"} />
            {!isSalaried ? (
               <StatItem label="Contact Number" val={profile.business?.contactNo || "Not set"} />
            ) : (
               <StatItem label="Official Email" val={profile.business?.email || "Not set"} />
            )}
            <StatItem label={isSalaried ? "Location / Address" : "Business Address"} val={profile.business?.address || "Not set"} />
            
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Visiting Card</p>
              {profile.business?.visitingCardImage ? (
                <div onClick={() => window.open(profile.business.visitingCardImage)}
                  className="w-full h-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-black cursor-pointer hover:bg-slate-100 transition-all uppercase tracking-widest">
                  <CreditCard size={14} className="mr-2" /> View Digital Card
                </div>
              ) : <span className="text-xs text-slate-400 font-medium">Not uploaded</span>}
            </div>
          </div>
        )}
      </Card>

      {/* Membership Stats | Social */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <SectionHeader title="Membership Statistics" />
          <div className="grid grid-cols-2 gap-3">
            <MiniBadge icon={<Award size={16}/>} label="ROLE" val={member.role || "Member"} bg="bg-orange-50" text="text-orange-600" />
            <MiniBadge icon={<Briefcase size={16}/>} label="BUSINESS" val={profile.business?.name || "Not set"} bg="bg-blue-50" text="text-blue-600" />
            <MiniBadge icon={<Shield size={16}/>} label="CATEGORY" val={member.membershipCategory || "Member"} bg="bg-purple-50" text="text-purple-700" />
            <MiniBadge icon={<CheckCircle size={16}/>} label="VISIBILITY" val="Public" bg="bg-slate-900" text="text-slate-100" />
          </div>
        </Card>

        {/* Connect with Me — editable */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Connect with Me</h3>
            <button
              onClick={() => { setSocialForm({ website: social.website||'', linkedin: social.linkedin||'', instagram: social.instagram||'', facebook: social.facebook||'', twitter: social.twitter||'', youtube: social.youtube||'', customLinks: social.customLinks||[] }); setShowSocialModal(true); }}
              className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:opacity-70 transition-all"
            >
              <Pencil size={12}/> Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {social.website && <SocialLink href={social.website} icon={<Globe size={16}/>} color="text-slate-500" />}
            {social.linkedin && <SocialLink href={social.linkedin} icon={<Linkedin size={16}/>} color="text-blue-600" />}
            {social.instagram && <SocialLink href={social.instagram} icon={<Instagram size={16}/>} color="text-pink-600" />}
            {social.facebook && <SocialLink href={social.facebook} icon={<Facebook size={16}/>} color="text-blue-800" />}
            {social.twitter && <SocialLink href={social.twitter} icon={<Twitter size={16}/>} color="text-sky-500" />}
            {social.youtube && <SocialLink href={social.youtube} icon={<Youtube size={16}/>} color="text-red-600" />}
            {social.customLinks?.map((link, idx) => (
               <SocialLink key={idx} href={link.url} icon={<LinkIcon size={16}/>} color="text-slate-500" title={link.name} />
            ))}
            {!social.website && !social.linkedin && !social.instagram && !social.facebook && !social.twitter && !social.youtube && (!social.customLinks || social.customLinks.length === 0) && (
              <p className="text-sm text-slate-400 italic">No social links added yet. Click Edit to add.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Family Section */}
      {isMarried && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="Family Registry" actionIcon={UserPlus} />
          <div className="w-full overflow-x-auto pb-2 no-scrollbar">
            <table className="w-full min-w-[550px] text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {['Relation','Full Name','Contact/DOB','Blood','Actions'].map((h,i) => (
                    <th key={h} className={`px-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ${i===4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profile.family?.spouse?.name && (
                  <FamilyRow relation="SPOUSE" name={profile.family.spouse.name} contact={profile.family.spouse.dob || '-'} bloodGroup={profile.family.spouse.bloodGroup || '-'} />
                )}
                {children.map((child, idx) => (
                  <FamilyRow key={idx} relation={`CHILD ${idx+1}`} name={child.name} contact={child.dob || '-'} bloodGroup={child.bloodGroup || '-'} />
                ))}
                {(!profile.family?.spouse?.name && children.length === 0) && (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-400 text-sm italic">No family members registered</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {children.length < 3 && (
            <button onClick={addChild} className="mt-4 flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all w-fit">
              <Plus size={14} /> ADD CHILD
            </button>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-white border-red-100 flex-1">
            <SectionHeader title="Blood Donation Log" actionIcon={Plus} />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-500 shrink-0 border border-red-50">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">LAST DONATED</p>
                <p className="text-xs text-slate-500 font-medium">12 Aug 2023 • Apollo Hospitals</p>
                <p className="text-[9px] text-red-500 font-black mt-1 uppercase tracking-widest">Thank you for saving lives!</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900 text-white flex-1">
            <SectionHeader title="Foundations" />
            <div className="space-y-4">
              <DLItem label="INDIA FOUNDATION" sub="Active Patron Member" active />
              <DLItem label="PHILANTHROPY" sub="School Support Drive" />
            </div>
          </Card>
        </div>
      </div>
      )}

      {/* ── EDIT SOCIAL MODAL ── */}
      {showSocialModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Social Links</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Edit · Add · Remove</p>
              </div>
              <button onClick={() => setShowSocialModal(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {[
                { key: 'website', label: 'Website / Portfolio', icon: <Globe size={14}/>, placeholder: 'https://yourwebsite.com' },
                { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={14}/>, placeholder: 'https://linkedin.com/in/...' },
                { key: 'instagram', label: 'Instagram', icon: <Instagram size={14}/>, placeholder: 'https://instagram.com/...' },
                { key: 'facebook', label: 'Facebook', icon: <Facebook size={14}/>, placeholder: 'https://facebook.com/...' },
                { key: 'twitter', label: 'Twitter / X', icon: <Twitter size={14}/>, placeholder: 'https://twitter.com/...' },
                { key: 'youtube', label: 'YouTube', icon: <Youtube size={14}/>, placeholder: 'https://youtube.com/@...' },
              ].map(({key, label, icon, placeholder}) => (
                <div key={key}>
                  <label className="flex items-center gap-1.5 mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    {icon} {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={socialForm[key] || ''}
                      onChange={e => setSocialForm({...socialForm, [key]: e.target.value})}
                      placeholder={placeholder}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                    {socialForm[key] && (
                      <button onClick={() => setSocialForm({...socialForm, [key]: ''})} className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Extra Links Dynamic Field */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">
                   Extra Links
                   <button type="button" className="text-blue-500 hover:text-blue-600 transition" onClick={() => setSocialForm({...socialForm, customLinks:[...(socialForm.customLinks||[]), {name:'',url:''}]})}>+ Add New</button>
                </label>
                <div className="space-y-2">
                  {socialForm.customLinks?.map((link, idx) => (
                    <div key={`c-${idx}`} className="flex items-center gap-2">
                      <input type="text" placeholder="Platform Name" value={link.name} onChange={e => { const nl=[...socialForm.customLinks]; nl[idx].name=e.target.value; setSocialForm({...socialForm, customLinks:nl})}} className="w-1/3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500" />
                      <input type="url" placeholder="URL" value={link.url} onChange={e => { const nl=[...socialForm.customLinks]; nl[idx].url=e.target.value; setSocialForm({...socialForm, customLinks:nl})}} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500" />
                      <button type="button" onClick={() => { const nl=[...socialForm.customLinks]; nl.splice(idx,1); setSocialForm({...socialForm, customLinks:nl}); }} className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center shrink-0 hover:bg-red-100 transition"><X size={14}/></button>
                    </div>
                  ))}
                  {(!socialForm.customLinks || socialForm.customLinks.length === 0) && (
                     <p className="text-xs text-slate-400 font-medium italic">No extra links added.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowSocialModal(false)} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button
                  onClick={saveSocialLinks}
                  disabled={updateLoading}
                  className="flex-1 rounded-2xl bg-blue-600 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {updateLoading ? 'Saving...' : 'Save Links'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Member Security</p>
              </div>
              <button onClick={closePasswordModal} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-5 px-6 py-6">
              {passwordStatus.message && (
                <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${passwordStatus.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-red-200 bg-red-50 text-red-600'}`}>
                  {passwordStatus.message}
                </div>
              )}
              {[
                { label: 'Current Password', key: 'currentPassword', placeholder: 'Enter current password' },
                { label: 'New Password', key: 'newPassword', placeholder: 'Min 8 chars: upper, lower, number' },
                { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Re-enter new password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{f.label}</label>
                  <input
                    type="password"
                    value={passwordForm[f.key]}
                    onChange={e => setPasswordForm({...passwordForm, [f.key]: e.target.value})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="button" onClick={closePasswordModal} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-600 transition hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={passwordLoading} className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-blue-700 disabled:opacity-60">
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD CHILD MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Add Child Details</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Member Family Services</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveChild} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Child's Full Name</label>
                <input required type="text" placeholder="Enter full legal name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">DOB</label>
                  <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Blood Group</label>
                  <select required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select Group</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Confirm Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---
const StatItem = ({ label, val }) => (
  <div className="group">
    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1 group-hover:text-blue-500 transition-colors">{label}</p>
    <p className="text-sm font-bold text-slate-700">{val}</p>
  </div>
);

const CommItem = ({ icon, val, badge }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:translate-x-1 transition-transform">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">{icon}</div>
      <span className="text-sm text-slate-700 font-medium">{val}</span>
    </div>
    {badge && <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest scale-90">{badge}</span>}
  </div>
);

const MiniBadge = ({ icon, bg, text, label, val }) => (
  <div className={`${bg} p-4 rounded-2xl flex flex-col items-center text-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow group`}>
    <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${text} shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
      <p className={`text-[11px] font-black ${text === 'text-slate-100' ? 'text-white' : 'text-slate-700'} leading-tight`}>{val}</p>
    </div>
  </div>
);

const SocialLink = ({ href, icon, color, title }) => (
  <a href={href} target="_blank" rel="noreferrer" title={title}
    className={`w-11 h-11 rounded-2xl bg-white border border-slate-100 ${color} flex items-center justify-center hover:bg-slate-900 hover:text-white hover:-translate-y-1 transition-all cursor-pointer shadow-sm`}>
    {icon}
  </a>
);

const FamilyRow = ({ relation, name, contact, bloodGroup }) => (
  <tr className="bg-white hover:bg-slate-50 transition-colors group">
    <td className="py-4 px-4 rounded-l-2xl border-y border-l border-slate-50"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{relation}</span></td>
    <td className="py-4 px-4 border-y border-slate-50"><p className="text-sm font-bold text-slate-800">{name}</p></td>
    <td className="py-4 px-4 border-y border-slate-50"><p className="text-sm text-slate-500 font-medium">{contact}</p></td>
    <td className="py-4 px-4 border-y border-slate-50"><span className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-black">{bloodGroup}</span></td>
    <td className="py-4 px-4 rounded-r-2xl border-y border-r border-slate-50 text-right">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Pencil size={12} /></button>
        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={12} /></button>
      </div>
    </td>
  </tr>
);

const DLItem = ({ label, sub, active }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded-xl transition-all group">
    <div>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-blue-400' : 'text-emerald-400'}`}>{label}</p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>
    </div>
    <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-white transition-colors cursor-pointer">
      <Download size={16} />
    </div>
  </div>
);
