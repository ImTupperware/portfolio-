"use client";

import React, { useState } from "react";
import { ResumeAiParsedData } from "../api/use-resume-ai-import";
import { Briefcase, GraduationCap, Award, Code, MapPin, Phone, CheckCircle2, Edit3, Check } from "lucide-react";

interface Props {
  data: ResumeAiParsedData;
  onChange?: (updated: ResumeAiParsedData) => void;
}

export function ResumeAiPreviewCard({ data, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, experiences = [], skills = [], certifications = [], educations = [] } = data;

  const updateProfileField = (field: string, val: string) => {
    if (!onChange) return;
    onChange({
      ...data,
      profile: { ...data.profile, [field]: val },
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-indigo-500/20 bg-slate-900/60 p-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[11px] font-semibold text-slate-400">Extracted Resume Preview</span>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition"
        >
          {isEditing ? <><Check className="h-3 w-3" /> Done Editing</> : <><Edit3 className="h-3 w-3" /> Edit Info</>}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-2.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Your Full Name</label>
            <input
              type="text"
              value={profile?.name || ""}
              onChange={(e) => updateProfileField("name", e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Professional Title</label>
            <input
              type="text"
              value={profile?.title || ""}
              onChange={(e) => updateProfileField("title", e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Location / City</label>
              <input
                type="text"
                value={profile?.location || ""}
                onChange={(e) => updateProfileField("location", e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Phone / WhatsApp</label>
              <input
                type="text"
                value={profile?.phone || profile?.whatsapp || ""}
                onChange={(e) => {
                  if (!onChange) return;
                  onChange({
                    ...data,
                    profile: {
                      ...data.profile,
                      phone: e.target.value,
                      whatsapp: e.target.value,
                    },
                  });
                }}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{profile?.name || "Extracted Profile"}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </h4>
            <p className="text-indigo-400 font-medium">{profile?.title || "Professional Title"}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-slate-400">
            {profile?.location && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" />{profile.location}</span>
            )}
            {(profile?.phone || profile?.whatsapp) && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-emerald-500" />{profile.whatsapp || profile.phone}</span>
            )}
          </div>
        </div>
      )}

      {/* Summary preview */}
      {profile?.summary && !isEditing && (
        <p className="line-clamp-2 text-slate-300 italic text-[11px]">
          &ldquo;{profile.summary}&rdquo;
        </p>
      )}

      {/* Stats Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
          <Briefcase className="h-4 w-4 mx-auto mb-1 text-sky-400" />
          <span className="block font-bold text-white">{experiences.length}</span>
          <span className="text-[10px] text-slate-400">Experiences</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
          <Code className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
          <span className="block font-bold text-white">{skills.length}</span>
          <span className="text-[10px] text-slate-400">Skills</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
          <Award className="h-4 w-4 mx-auto mb-1 text-amber-400" />
          <span className="block font-bold text-white">{certifications.length}</span>
          <span className="text-[10px] text-slate-400">Certs</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2">
          <GraduationCap className="h-4 w-4 mx-auto mb-1 text-purple-400" />
          <span className="block font-bold text-white">{educations.length}</span>
          <span className="text-[10px] text-slate-400">Education</span>
        </div>
      </div>
    </div>
  );
}
