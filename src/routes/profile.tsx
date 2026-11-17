import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  FileImage,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/infratrack";
import {
  createOptimizedAvatar,
  uploadAvatarToStorage,
  validateAvatarFile,
} from "@/lib/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Citizen & Authority Profile — InfraTrack" },
      { name: "description", content: "Update your profile photo, contact details, and municipal clearance." },
      { property: "og:title", content: "Citizen & Authority Profile — InfraTrack" },
      { property: "og:description", content: "Manage your InfraTrack profile and avatar photo." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ProfileRouteWrapper />
    </RequireAuth>
  ),
});

function ProfileRouteWrapper() {
  const { t } = useLanguage();
  return (
    <AppShell title={t("profile.header_title", "Citizen & Authority Profile")} fullWidth>
      <ProfilePage />
    </AppShell>
  );
}

function ProfilePage() {
  const { profile, user, isAdmin, refresh, updateProfileAvatar } = useAuth();
  const { t, language } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Profile Photo Upload & Preview State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      toast.error(validation.error || (language === "hi" ? "अमान्य फ़ाइल चुनी गई।" : "Invalid file chosen."));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Set preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(objectUrl);
  }

  function cancelPreview() {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function savePreviewPhoto() {
    if (!previewFile || !user) return;
    setUploadingPhoto(true);

    try {
      // 1. Optimize image into a clean square format for circular avatar
      const optimizedBlob = await createOptimizedAvatar(previewFile, 400);

      // 2. Upload to storage
      const uploadedUrl = await uploadAvatarToStorage(user.id, optimizedBlob);

      // 3. Update profile avatar in database and auth context
      await updateProfileAvatar(uploadedUrl);

      toast.success(language === "hi" ? "प्रोफ़ाइल फोटो सफलतापूर्वक सहेजी गई!" : "Profile photo saved successfully!");
      cancelPreview();
    } catch (err: unknown) {
      console.error("Avatar save error:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload photo";
      toast.error(language === "hi" ? `फोटो अपलोड विफल: ${msg}` : `Photo upload failed: ${msg}`);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleRemovePhoto() {
    if (!user || !profile?.avatar_url) return;
    const confirmRemove = window.confirm(
      language === "hi"
        ? "क्या आप निश्चित रूप से अपनी प्रोफ़ाइल फोटो हटाना चाहते हैं? यह डिफ़ॉल्ट अवतार पर वापस आ जाएगा।"
        : "Are you sure you want to remove your profile photo? This will revert to your default initials avatar."
    );
    if (!confirmRemove) return;

    setRemovingPhoto(true);
    try {
      await updateProfileAvatar(null);
      toast.success(language === "hi" ? "प्रोफ़ाइल फोटो हटा दी गई।" : "Profile photo removed.");
      cancelPreview();
    } catch (err: unknown) {
      console.error("Remove avatar error:", err);
      const msg = err instanceof Error ? err.message : "Failed to remove photo";
      toast.error(language === "hi" ? `फोटो हटाने में त्रुटि: ${msg}` : `Failed to remove photo: ${msg}`);
    } finally {
      setRemovingPhoto(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refresh();
    toast.success(language === "hi" ? "प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट हुआ!" : "Profile updated successfully!");
  }

  async function claimAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_admin_role", {
      secret_code: code.trim(),
    });
    setClaiming(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      toast.error(language === "hi" ? "यह एक्सेस कोड मान्य नहीं है। कृपया पुनः जांचें।" : "That access code is not valid. Please check and try again.");
      return;
    }
    setCode("");
    await refresh();
    toast.success(language === "hi" ? "प्राधिकारी विशेषाधिकार अनलॉक हो गए! एडमिन कंसोल आपके मेनू में जुड़ गया।" : "Authority privileges unlocked! Admin console added to your menu.");
  }

  return (
    <div className="space-y-8 w-full">
      {/* Hidden File Input for Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Upload profile photo"
      />

      {/* Profile Overview & Photo Management Card — Generous Full-Width Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar Container with Edit Overlay */}
          <div className="relative group shrink-0">
            <UserAvatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              size="2xl"
              ring
              className="h-28 w-28 sm:h-32 sm:w-32 shadow-md transition-transform duration-200 group-hover:scale-[1.03]"
            />

            {/* Quick Camera Action Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-foreground/65 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer backdrop-blur-2xs"
              title={t("profile.edit_photo", "Edit Profile Photo")}
              aria-label={t("profile.edit_photo", "Edit Profile Photo")}
            >
              <Camera className="h-7 w-7 mb-1" />
              <span className="text-[11px] font-bold tracking-tight uppercase">
                {language === "hi" ? "बदलें" : "Change"}
              </span>
            </button>

            {/* Status indicator pin */}
            <span
              className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-card ${isAdmin ? "bg-amber-500" : "bg-primary"
                }`}
              title={isAdmin ? t("role.officer", "Municipal Officer") : t("role.resident", "Registered Resident")}
            />
          </div>

          {/* User Details & Action Controls */}
          <div className="flex-1 text-center sm:text-left space-y-3.5 min-w-0">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  {profile?.full_name || (language === "hi" ? "नागरिक खाता" : "Citizen Account")}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${isAdmin
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                >
                  {isAdmin ? (
                    <>
                      <BadgeCheck className="h-4 w-4" /> {t("role.officer", "Municipal Officer")}
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" /> {t("role.resident", "Registered Resident")}
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{profile?.email ?? user?.email}</p>
              <p className="text-xs text-muted-foreground/80">
                {t("profile.member_since", "Member since")} {formatDate(profile?.created_at)}
              </p>
            </div>

            {/* Profile Photo Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-xs font-bold h-9 px-4 border-border hover:border-primary hover:text-primary shadow-2xs"
              >
                <Camera className="h-4 w-4 text-primary" />
                {profile?.avatar_url
                  ? t("profile.edit_photo", "Edit Profile Photo")
                  : t("profile.upload_photo", "Upload Profile Photo")}
              </Button>

              {profile?.avatar_url ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  disabled={removingPhoto}
                  className="gap-1.5 text-xs font-semibold h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {removingPhoto ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  {t("profile.remove_photo", "Remove Photo")}
                </Button>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              {t("profile.photo_hint", "Supports JPG, JPEG, PNG, or WEBP up to 5 MB. Photos are automatically centered and cropped to a circular avatar.")}
            </p>
          </div>
        </div>

        {/* Live Photo Preview Card (Shown before saving) */}
        {previewUrl ? (
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5 sm:p-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                {/* Circular Preview */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary shadow-sm bg-card">
                  <img
                    src={previewUrl}
                    alt="Uploaded photo preview"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> {t("profile.ready_to_save", "Ready to Save")}
                  </div>
                  <p className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                    {previewFile?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {previewFile ? (previewFile.size / 1024).toFixed(0) : "0"} KB · {language === "hi" ? "गोलाकार प्रोफ़ाइल अवतार के रूप में सेट होगा" : "Will be set as your circular profile avatar"}
                  </p>
                </div>
              </div>

              {/* Confirm / Cancel Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelPreview}
                  disabled={uploadingPhoto}
                  className="text-xs font-semibold h-9"
                >
                  <X className="h-3.5 w-3.5 mr-1" /> {t("action.cancel", "Cancel")}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={savePreviewPhoto}
                  disabled={uploadingPhoto}
                  className="gap-2 font-bold text-xs h-9 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> {language === "hi" ? "सहेजा जा रहा है..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> {t("profile.save_photo", "Save Profile Photo")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Balanced 2-Column Wide Layout for Personal Info & Authority Access */}
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Account Details Form */}
        <form onSubmit={save} className="space-y-5 rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-card">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("profile.personal_info", "Personal Information")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("profile.personal_desc", "Update how your name appears on filed grievances.")}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="name" className="text-xs font-bold text-foreground/80">
              {t("profile.full_name", "Full Name")}
            </Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 text-sm bg-background border-border"
              placeholder="e.g. Anand Kumar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-foreground/80">
              {t("profile.email_label", "Email Address (Read-only)")}
            </Label>
            <Input
              id="email"
              value={profile?.email ?? user?.email ?? ""}
              disabled
              className="h-11 text-sm bg-muted/40 cursor-not-allowed border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold text-foreground/80">
              {t("profile.phone_label", "Phone Number")}
            </Label>
            <Input
              id="phone"
              value={phone}
              placeholder="+91 98xxxxxxxx"
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 text-sm bg-background border-border"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="sm" className="gap-2 font-bold h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {language === "hi" ? "सहेजा जा रहा है..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {t("profile.save_changes", "Save Changes")}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Access Level / Authority Unlock Box */}
        <div className="space-y-5 rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-card">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("profile.authority_title", "Municipal Authority Access")}
            </h3>
          </div>

          {isAdmin ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3.5">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                <Check className="h-5 w-5" />
                <p className="text-sm font-bold">
                  {t("profile.authority_authorized", "Authorized Municipal Officer")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("profile.authority_authorized_desc", "You have active municipal clearance to triage grievances, dispatch department work crews, update status notes, and view city-wide infrastructure analytics.")}
              </p>
              <Link to="/admin">
                <Button size="sm" className="w-full gap-2 text-xs font-bold h-10 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                  {t("profile.open_workspace", "Open Authority Workspace")} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("profile.authority_prompt", "Are you an engineer, department head, or municipal inspector? Enter your access authorization code below to unlock the municipal management console.")}
              </p>

              <form onSubmit={claimAdmin} className="space-y-3.5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs font-bold text-foreground/80">
                    {t("profile.access_code", "Access Authorization Code")}
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="code"
                      type="password"
                      placeholder="••••••••••••"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="h-11 pl-10 text-sm bg-background border-border"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  className="w-full gap-2 text-xs font-bold h-10 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={claiming}
                >
                  {claiming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {language === "hi" ? "सत्यापित हो रहा है..." : "Verifying..."}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> {t("profile.unlock_btn", "Verify & Unlock Privileges")}
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
