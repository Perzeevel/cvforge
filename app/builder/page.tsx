"use client";

import AuthGuard from "../components/AuthGuard";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
type Template = "modern" | "executive" | "minimal";

type AccentColor =
  | "blue"
  | "purple"
  | "green"
  | "red"
  | "orange"
  | "black";



type Experience = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  details: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  jobDescription: string;
};

type SavedCV = {
  id: string;
  name: string;
  form: FormData;
  template: Template;
  accentColor: AccentColor;
  updatedAt: number;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  summary: "",
  experience: [
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      graduationYear: "",
      details: "",
    },
  ],
  skills: "",
  jobDescription: "",
};

/* =========================
   HELPERS
========================= */

function formatExperience(items: Experience[]) {
  return items
    .filter(
      (item) =>
        item.jobTitle ||
        item.company ||
        item.location ||
        item.startDate ||
        item.endDate ||
        item.description
    )
    .map(
      (item) =>
        `${item.jobTitle || "Job Title"} — ${
          item.company || "Company"
        }
${item.location || ""}
${item.startDate || ""}${
          item.startDate || item.endDate ? " - " : ""
        }${item.endDate || "Present"}
${item.description || ""}`
    )
    .join("\n\n");
}

function formatEducation(items: Education[]) {
  return items
    .filter(
      (item) =>
        item.degree ||
        item.institution ||
        item.location ||
        item.graduationYear ||
        item.details
    )
    .map(
      (item) =>
        `${item.degree || "Degree / Qualification"} — ${
          item.institution || "Institution"
        }
${item.location || ""} ${item.graduationYear || ""}
${item.details || ""}`
    )
    .join("\n\n");
}

/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <h3
      className={`mb-3 border-b pb-2 text-sm font-bold uppercase tracking-[0.18em] ${
        dark
          ? "border-white/20 text-white"
          : "border-slate-200 text-slate-800"
      }`}
    >
      {children}
    </h3>
  );
}

/* =========================
   SKILLS
========================= */

function Skills({
  value,
  dark = false,
}: {
  value: string;
  dark?: boolean;
}) {
  const skills = value
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <span
            key={index}
            className={`rounded-full px-3 py-1 text-xs ${
              dark
                ? "bg-white/10 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {skill}
          </span>
        ))
      ) : (
        <span
          className={dark ? "text-white/50" : "text-slate-400"}
        >
          Your skills
        </span>
      )}
    </div>
  );
}

/* =========================
   EXPERIENCE LIST
========================= */

function ExperienceList({
  items,
  dark = false,
}: {
  items: Experience[];
  dark?: boolean;
}) {
  const filled = items.filter(
    (item) =>
      item.jobTitle ||
      item.company ||
      item.location ||
      item.startDate ||
      item.endDate ||
      item.description
  );

  if (!filled.length) {
    return (
      <p
        className={
          dark ? "text-sm text-slate-400" : "text-sm text-slate-400"
        }
      >
        Your work experience will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {filled.map((item, index) => (
        <div key={index}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4
                className={`font-bold ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                {item.jobTitle || "Job Title"}
              </h4>

              <p
                className={`text-sm font-medium ${
                  dark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {item.company || "Company"}
              </p>
            </div>

            {(item.startDate || item.endDate) && (
              <span
                className={`text-xs ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {item.startDate || ""}
                {item.startDate || item.endDate ? " – " : ""}
                {item.endDate || "Present"}
              </span>
            )}
          </div>

          {item.location && (
            <p
              className={`mt-1 text-xs ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.location}
            </p>
          )}

          {item.description && (
            <p
              className={`mt-2 whitespace-pre-line text-sm leading-6 ${
                dark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================
   EDUCATION LIST
========================= */

function EducationList({
  items,
  dark = false,
}: {
  items: Education[];
  dark?: boolean;
}) {
  const filled = items.filter(
    (item) =>
      item.degree ||
      item.institution ||
      item.location ||
      item.graduationYear
  );

  if (!filled.length) {
    return (
      <p
        className={
          dark ? "text-sm text-slate-400" : "text-sm text-slate-400"
        }
      >
        Your education will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {filled.map((item, index) => (
        <div key={index}>
          <h4
            className={`font-bold ${
              dark ? "text-white" : "text-slate-800"
            }`}
          >
            {item.degree || "Degree / Qualification"}
          </h4>

          <p
            className={`text-sm font-medium ${
              dark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {item.institution || "Institution"}
          </p>

          {item.location && (
            <p
              className={`text-xs ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.location}
            </p>
          )}

          {item.graduationYear && (
            <p
              className={`text-xs ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {item.graduationYear}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================
   MODERN TEMPLATE
========================= */

const accentClasses = {
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-600",
  },
  green: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-600",
  },
  red: {
    bg: "bg-red-600",
    text: "text-red-600",
    border: "border-red-600",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
  },
  black: {
    bg: "bg-slate-950",
    text: "text-slate-950",
    border: "border-slate-950",
  },
};

// const accent = accentClasses[accentColor];

function ModernTemplate({
  form,
  accentColor,
}: {
  form: FormData;
  accentColor: AccentColor;
}) {
  const accent = accentClasses[accentColor];
  const initials = form.name
    ? form.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CV";

  const skills = form.skills
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  const experiences = form.experience.filter(
    (item) =>
      item.jobTitle ||
      item.company ||
      item.location ||
      item.startDate ||
      item.endDate ||
      item.description
  );

  const educations = form.education.filter(
    (item) =>
      item.degree ||
      item.institution ||
      item.location ||
      item.graduationYear
  );

  return (
    <div className="min-h-[1123px] bg-white text-slate-900 print:break-after-page">
      <div className="grid min-h-[1123px] grid-cols-[225px_1fr] print:min-h-0">

        {/* LEFT ACCENT RAIL */}
        <aside className={`${accent.bg} px-6 py-9 text-white`}>

          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white text-xl font-black text-slate-950">
            {initials}
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Contact
            </p>

            <div className="mt-4 space-y-4 text-xs leading-5 text-slate-300">
              {form.email && (
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">
                    Email
                  </p>
                  <p className="break-words">{form.email}</p>
                </div>
              )}

              {form.phone && (
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">
                    Phone
                  </p>
                  <p>{form.phone}</p>
                </div>
              )}

              {form.location && (
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">
                    Location
                  </p>
                  <p>{form.location}</p>
                </div>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Expertise
              </p>

              <div className="mt-4 space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="border-l border-slate-700 pl-3 text-xs text-slate-300"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {educations.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Education
              </p>

              <div className="mt-4 space-y-5">
                {educations.map((edu, index) => (
                  <div key={index}>
                    <p className="text-xs font-bold text-white">
                      {edu.degree || "Degree"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {edu.institution || "Institution"}
                    </p>

                    {edu.graduationYear && (
                      <p className="mt-1 text-[10px] text-slate-500">
                        {edu.graduationYear}
                      </p>
                    )}

{edu.details && (
  <p className="mt-2 whitespace-pre-line text-[10px] leading-5 text-slate-400">
    {edu.details}
  </p>
)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="px-9 py-10">

          {/* HEADER */}
          <header className="border-b border-slate-200 pb-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Curriculum Vitae
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              {form.name || "Your Name"}
            </h1>

            <p className="mt-2 text-base font-medium text-slate-500">
              {form.jobTitle || "Professional Title"}
            </p>
          </header>

          {/* PROFILE */}
          <section className="mt-8">
            <div className="flex items-center gap-3">
            <span className={`h-5 w-1 ${accent.bg}`} />

              <h2 className="text-[11px] font-black uppercase tracking-[0.22em]">
                Profile
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {form.summary ||
                "Write a concise professional summary highlighting your experience, strengths, and career value."}
            </p>
          </section>

          {/* EXPERIENCE */}
          <section className="mt-9">
            <div className="flex items-center gap-3">
            <span className={`h-5 w-1 ${accent.bg}`} />

              <h2 className="text-[11px] font-black uppercase tracking-[0.22em]">
                Experience
              </h2>
            </div>

            <div className="mt-6 space-y-7">
              {experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <article key={index} className="relative pl-6">

<span
  className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${accent.bg}`}
/>
                    {index !== experiences.length - 1 && (
                      <span className="absolute left-[3px] top-4 h-[calc(100%+20px)] w-px bg-slate-200" />
                    )}

                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">
                          {exp.jobTitle || "Job Title"}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {exp.company || "Company"}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                      </div>

                      {(exp.startDate || exp.endDate) && (
                        <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {exp.startDate || "Start"} —{" "}
                          {exp.endDate || "Present"}
                        </p>
                      )}
                    </div>

                    {exp.description && (
                      <p className="mt-3 text-xs leading-6 text-slate-600">
                        {exp.description}
                      </p>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-xs text-slate-400">
                  Your work experience will appear here.
                </p>
              )}
            </div>
          </section>

          <footer className="mt-12 border-t border-slate-200 pt-4">
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
              CVForge · Modern Professional
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* =========================
   EXECUTIVE TEMPLATE
========================= */

function ExecutiveTemplate({
  form,
  accentColor,
}: {
  form: FormData;
  accentColor: AccentColor;
}) {
  const accent = accentClasses[accentColor];

  const skills = form.skills
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  const experiences = form.experience.filter(
    (item) =>
      item.jobTitle ||
      item.company ||
      item.location ||
      item.startDate ||
      item.endDate ||
      item.description
  );

  const educations = form.education.filter(
    (item) =>
      item.degree ||
      item.institution ||
      item.location ||
      item.graduationYear
  );

  return (
    <div className="min-h-[1123px] bg-white text-slate-900">

      {/* TOP BAND */}
      <header className={`${accent.bg} px-12 py-10 text-white`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
          Professional Resume
        </p>

        <div className="mt-5 flex items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {form.name || "Your Name"}
            </h1>

            <p className="mt-2 text-base font-medium text-slate-300">
              {form.jobTitle || "Professional Title"}
            </p>
          </div>

          <div className="text-right text-[10px] leading-5 text-slate-400">
            {form.email && <p>{form.email}</p>}
            {form.phone && <p>{form.phone}</p>}
            {form.location && <p>{form.location}</p>}
          </div>
        </div>
      </header>

      <main className="px-12 py-9">

        {/* SUMMARY */}
        <section>
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">
              Executive Summary
            </h2>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {form.summary ||
              "A concise professional summary highlighting leadership, experience, expertise, and career value."}
          </p>
        </section>

        {/* EXPERIENCE */}
        <section className="mt-9">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">
              Professional Experience
            </h2>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-6 space-y-8">
            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <article key={index}>

                  <div className="grid grid-cols-[1fr_auto] gap-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-950">
                        {exp.jobTitle || "Job Title"}
                      </h3>

                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {exp.company || "Company"}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    </div>

                    {(exp.startDate || exp.endDate) && (
                      <p className="text-right text-[10px] font-bold text-slate-400">
                        {exp.startDate || "Start"}
                        {" — "}
                        {exp.endDate || "Present"}
                      </p>
                    )}
                  </div>

                  {exp.description && (
                    <p className="mt-3 text-xs leading-6 text-slate-600">
                      {exp.description}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                Your professional experience will appear here.
              </p>
            )}
          </div>
        </section>

        {/* LOWER INFORMATION */}
        <div className="mt-10 grid grid-cols-2 gap-12 border-t border-slate-200 pt-8">

          {/* EDUCATION */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
              Education
            </h2>

            <div className="mt-5 space-y-5">
              {educations.length > 0 ? (
                educations.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-bold text-slate-950">
                      {edu.degree || "Degree"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {edu.institution || "Institution"}
                    </p>

                    {(edu.location || edu.graduationYear) && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        {edu.location}
                        {edu.location &&
                          edu.graduationYear &&
                          " · "}
                        {edu.graduationYear}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">
                  Add your education.
                </p>
              )}
            </div>
          </section>

          {/* EXPERTISE */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
              Core Expertise
            </h2>

            {skills.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-100 pb-2 text-xs text-slate-600"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-xs text-slate-400">
                Add your professional skills.
              </p>
            )}
          </section>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-4">
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
            CVForge · Executive Series
          </p>
        </footer>
      </main>
    </div>
  );
}

/* =========================
   MINIMAL TEMPLATE
========================= */

function MinimalTemplate({
  form,
  accentColor,
}: {
  form: FormData;
  accentColor: AccentColor;
}) {
  const accent = accentClasses[accentColor];
  const skills = form.skills
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  const experiences = form.experience.filter(
    (item) =>
      item.jobTitle ||
      item.company ||
      item.location ||
      item.startDate ||
      item.endDate ||
      item.description
  );

  const educations = form.education.filter(
    (item) =>
      item.degree ||
      item.institution ||
      item.location ||
      item.graduationYear
  );

  return (
    <div className="min-h-[1123px] bg-white px-12 py-11 text-black">

      {/* HEADER */}
      <header className={`border-b-2 ${accent.border} pb-5`}>

        <h1 className="text-3xl font-black tracking-tight">
          {form.name || "YOUR NAME"}
        </h1>

        <p className="mt-1 text-sm font-semibold">
          {form.jobTitle || "Professional Title"}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-600">
          {form.email && <span>{form.email}</span>}
          {form.phone && (
            <>
              <span>•</span>
              <span>{form.phone}</span>
            </>
          )}
          {form.location && (
            <>
              <span>•</span>
              <span>{form.location}</span>
            </>
          )}
        </div>
      </header>

      {/* SUMMARY */}
      <section className="mt-7">
      <h2 className={`border-b ${accent.border} pb-1.5 text-[10px] font-black uppercase tracking-[0.25em]`}>
          Professional Summary
        </h2>

        <p className="mt-3 text-xs leading-6 text-slate-700">
          {form.summary ||
            "Write a concise professional summary highlighting your background, experience, and career strengths."}
        </p>
      </section>

      {/* EXPERIENCE */}
      <section className="mt-7">
      <h2 className={`border-b ${accent.border} pb-1.5 text-[10px] font-black uppercase tracking-[0.25em]`}>
          Work Experience
        </h2>

        <div className="mt-5 space-y-6">
          {experiences.length > 0 ? (
            experiences.map((exp, index) => (
              <article key={index}>

                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="text-xs font-bold">
                      {exp.jobTitle || "Job Title"}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      {exp.company || "Company"}
                      {exp.location && `, ${exp.location}`}
                    </p>
                  </div>

                  {(exp.startDate || exp.endDate) && (
                    <p className="whitespace-nowrap text-[10px] text-slate-500">
                      {exp.startDate || "Start"} —{" "}
                      {exp.endDate || "Present"}
                    </p>
                  )}
                </div>

                {exp.description && (
                  <p className="mt-2 text-xs leading-5 text-slate-700">
                    {exp.description}
                  </p>
                )}
              </article>
            ))
          ) : (
            <p className="text-xs text-slate-400">
              Your work experience will appear here.
            </p>
          )}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="mt-7">
      <h2 className={`border-b ${accent.border} pb-1.5 text-[10px] font-black uppercase tracking-[0.25em]`}>
          Education
        </h2>

        <div className="mt-5 space-y-5">
          {educations.length > 0 ? (
            educations.map((edu, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-5"
              >
                <div>
                  <h3 className="text-xs font-bold">
                    {edu.degree || "Degree / Qualification"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    {edu.institution || "Institution"}
                    {edu.location && `, ${edu.location}`}
                  </p>

                  {edu.details && (
  <p className="mt-2 text-xs leading-5 text-slate-700 whitespace-pre-line">
    {edu.details}
  </p>
)}
                </div>

                {edu.graduationYear && (
                  <p className="whitespace-nowrap text-[10px] text-slate-500">
                    {edu.graduationYear}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">
              Add your education.
            </p>
          )}
        </div>
      </section>

      {/* SKILLS */}
      <section className="mt-7">
      <h2 className={`border-b ${accent.border} pb-1.5 text-[10px] font-black uppercase tracking-[0.25em]`}>
          Skills
        </h2>

        {skills.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-x-7 gap-y-2">
            {skills.map((skill, index) => (
              <p key={index} className="text-xs text-slate-700">
                {skill}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-400">
            Add your skills.
          </p>
        )}
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-3">
        <p className="text-[8px] uppercase tracking-[0.25em] text-slate-400">
          CVForge · ATS-Friendly Resume
        </p>
      </footer>
    </div>
  );
}

const saveCVToFirestore = async (cv: SavedCV) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in to save your CV.");
  }

  await setDoc(
    doc(db, "users", user.uid, "cvs", cv.id),
    cv
  );
};




/* =========================
   MAIN BUILDER
========================= */

function BuilderPageContent() {
  const searchParams = useSearchParams();

  

  const [form, setForm] = useState<FormData>(emptyForm);
  const [template, setTemplate] = useState<Template>("modern");
  const [accentColor, setAccentColor] =
  useState<AccentColor>("blue");

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] =
    useState("Loading...");

    const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
const [currentCVId, setCurrentCVId] = useState<string>("default");
const [cvName, setCvName] = useState("My CV");

  // LOAD SAVED CVS
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const loadCVs = () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setIsLoaded(true);
          setSaveStatus("Not signed in");
          return;
        }
  
        try {
          const cvsRef = collection(
            db,
            "users",
            user.uid,
            "cvs"
          );
  
          const snapshot = await getDocs(cvsRef);
  
          if (!snapshot.empty) {
            const cloudCVs = snapshot.docs.map(
              (doc) => doc.data() as SavedCV
            );
  
            cloudCVs.sort(
              (a, b) => b.updatedAt - a.updatedAt
            );
  
            setSavedCVs(cloudCVs);
  
            const activeCV = cloudCVs[0];
  
            setCurrentCVId(activeCV.id);
            setCvName(activeCV.name);
            setForm(activeCV.form);
            setTemplate(activeCV.template);
            setAccentColor(activeCV.accentColor);
  
            console.log("CVs loaded from Firestore.");
          } else {
            // No cloud CVs yet.
            // Check localStorage and migrate existing CVs.
            const savedCVsData =
              localStorage.getItem("cvforge-cvs");
  
            if (savedCVsData) {
              const parsedCVs: SavedCV[] =
                JSON.parse(savedCVsData);
  
              if (
                Array.isArray(parsedCVs) &&
                parsedCVs.length > 0
              ) {
                setSavedCVs(parsedCVs);
  
                const activeCV = parsedCVs[0];
  
                setCurrentCVId(activeCV.id);
                setCvName(activeCV.name);
                setForm(activeCV.form);
                setTemplate(activeCV.template);
                setAccentColor(activeCV.accentColor);
  
                // Migrate existing CVs to Firestore.
                await Promise.all(
                  parsedCVs.map((cv) =>
                    setDoc(
                      doc(
                        db,
                        "users",
                        user.uid,
                        "cvs",
                        cv.id
                      ),
                      cv
                    )
                  )
                );
  
                console.log(
                  "Existing CVs migrated to Firestore."
                );
              }
            } else {
              // No cloud CVs and no local CVs.
              const oldForm =
                localStorage.getItem("cvforge-form");
  
              const oldAccent =
                localStorage.getItem(
                  "cvforge-accent-color"
                );
  
              let loadedForm = emptyForm;
  
              if (oldForm) {
                const parsedForm =
                  JSON.parse(oldForm);
  
                loadedForm = {
                  ...emptyForm,
                  ...parsedForm,
                  experience:
                    Array.isArray(
                      parsedForm.experience
                    ) &&
                    parsedForm.experience.length > 0
                      ? parsedForm.experience
                      : emptyForm.experience,
                  education:
                    Array.isArray(
                      parsedForm.education
                    ) &&
                    parsedForm.education.length > 0
                      ? parsedForm.education
                      : emptyForm.education,
                };
              }
  
              const migratedCV: SavedCV = {
                id: "cv-" + Date.now(),
                name:
                  loadedForm.name.trim() ||
                  "My CV",
                form: loadedForm,
                template: "modern",
                accentColor:
                  oldAccent === "blue" ||
                  oldAccent === "purple" ||
                  oldAccent === "green" ||
                  oldAccent === "red" ||
                  oldAccent === "orange" ||
                  oldAccent === "black"
                    ? oldAccent
                    : "blue",
                updatedAt: Date.now(),
              };
  
              setSavedCVs([migratedCV]);
              setCurrentCVId(migratedCV.id);
              setCvName(migratedCV.name);
              setForm(migratedCV.form);
              setTemplate(migratedCV.template);
              setAccentColor(
                migratedCV.accentColor
              );
  
              await saveCVToFirestore(
                migratedCV
              );
  
              console.log(
                "New CV created in Firestore."
              );
            }
          }
        } catch (error) {
          console.error(
            "Could not load CVs from Firestore:",
            error
          );
        } finally {
          setIsLoaded(true);
          setSaveStatus("Saved");
        }
      });
    };
  
    loadCVs();
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // AUTO-SAVE CV
  

  

    

  const [darkMode, setDarkMode] = useState(false);

  const [isPro, setIsPro] = useState(false);

  const [aiResult, setAiResult] = useState("");

  const [loading, setLoading] = useState(false);

  const [tailoring, setTailoring] = useState(false);

  const [tailoredResult, setTailoredResult] = useState("");

  const [tailoringExperienceIndex, setTailoringExperienceIndex] =
  useState<number | null>(null);

  const [experienceAIResult, setExperienceAIResult] = useState<{
    index: number;
    result: string;
  } | null>(null);

  const [tailoringEducationIndex, setTailoringEducationIndex] =
  useState<number | null>(null);

  const [educationAIResult, setEducationAIResult] = useState<{
    index: number;
    result: string;
  } | null>(null);

  const [atsAnalysis, setAtsAnalysis] = useState<{
    score: number;
    matchPercentage: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
    summary: string;
    tailoredSummary: string;
  } | null>(null);


  // AUTO-SAVE CURRENT CV
  useEffect(() => {
    if (!isLoaded) return;
  
    let cancelled = false;
  
    const saveCV = async () => {
      const user = auth.currentUser;
  
      if (!user) {
        setSaveStatus("Not signed in");
        return;
      }
  
      try {
        setSaveStatus("Saving...");
  
        const updatedCV: SavedCV = {
          id: currentCVId,
          name:
            cvName.trim() ||
            form.name.trim() ||
            "My CV",
          form,
          template,
          accentColor,
          updatedAt: Date.now(),
        };
  
        await saveCVToFirestore(updatedCV);
  
        if (cancelled) return;
  
        setSavedCVs((previous) => {
          const exists = previous.some(
            (cv) => cv.id === currentCVId
          );
  
          return exists
            ? previous.map((cv) =>
                cv.id === currentCVId
                  ? updatedCV
                  : cv
              )
            : [...previous, updatedCV];
        });
  
        setSaveStatus("Saved");
      } catch (error) {
        console.error(
          "Could not save CV to Firestore:",
          error
        );
  
        if (!cancelled) {
          setSaveStatus("Not saved");
        }
      }
    };
  
    const timer = setTimeout(saveCV, 500);
  
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    form,
    template,
    accentColor,
    cvName,
    currentCVId,
    isLoaded,
  ]);

  /* =========================
     FORM FUNCTIONS
  ========================= */

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateExperience(
    index: number,
    field: keyof Experience,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      experience: previous.experience.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  }

  function addExperience() {
    setForm((previous) => ({
      ...previous,
      experience: [
        ...previous.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  }

  function removeExperience(index: number) {
    setForm((previous) => ({
      ...previous,
      experience: previous.experience.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateEducation(
    index: number,
    field: keyof Education,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      education: previous.education.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  }

  function addEducation() {
    setForm((previous) => ({
      ...previous,
      education: [
        ...previous.education,
        {
          degree: "",
          institution: "",
          location: "",
          graduationYear: "",
          details: "",
        },
      ],
    }));
  }

  function removeEducation(index: number) {
    setForm((previous) => ({
      ...previous,
      education: previous.education.filter(
        (_, i) => i !== index
      ),
    }));
  }

  const clearCV = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear this CV?"
    );
  
    if (!confirmed) return;
  
    setForm({
      ...emptyForm,
      experience: [...emptyForm.experience],
      education: [...emptyForm.education],
    });
  
    setAtsAnalysis(null);
    setTailoredResult("");
    setAiResult("");
    setSaveStatus("Saving...");
  };

  function printCV() {
    window.print();
  }

  /* =========================
     LOCAL CV GENERATOR
  ========================= */

  function generateCV() {
    setLoading(true);

    setTimeout(() => {
      const improvedSummary =
        form.summary ||
        `${form.jobTitle || "Professional"} with a strong interest in building a successful career. Demonstrates a professional attitude, willingness to learn, and the ability to work effectively with others.`;

      const improvedExperience =
        formatExperience(form.experience) ||
        "Add your work experience, responsibilities, achievements, and key contributions here.";

      const improvedEducation =
        formatEducation(form.education) ||
        "Add your educational background, degree, school, and graduation year here.";

      const improvedSkills =
        form.skills ||
        "Communication, Teamwork, Problem Solving, Time Management";

      const result = `
${form.name || "Your Name"}
${form.jobTitle || "Professional Title"}

${form.email || "Email"} • ${
        form.phone || "Phone"
      } • ${form.location || "Location"}

PROFESSIONAL SUMMARY

${improvedSummary}

WORK EXPERIENCE

${improvedExperience}

EDUCATION

${improvedEducation}

SKILLS

${improvedSkills}
`;

      setAiResult(result);
      setLoading(false);
    }, 800);
  }

  /* =========================
     ATS ANALYSIS
  ========================= */

  function analyzeATS() {
    if (!form.jobDescription.trim()) {
      setAtsAnalysis({
        score: 0,
        matchPercentage: 0,
        matchedKeywords: [],
        missingKeywords: [],
        recommendations: [
          "Please paste a job description first.",
        ],
        summary:
          "A job description is required for ATS analysis.",
          tailoredSummary: "",
      });

      return;
    }

    const experienceText = formatExperience(
      form.experience
    );

    const educationText = formatEducation(
      form.education
    );

    const cvText = `
      ${form.jobTitle}
      ${form.summary}
      ${experienceText}
      ${educationText}
      ${form.skills}
    `.toLowerCase();

    const jobText =
      form.jobDescription.toLowerCase();

    const keywords = [
      "autocad",
      "microsoft office",
      "excel",
      "project management",
      "site supervision",
      "construction",
      "engineering",
      "drawings",
      "specifications",
      "quality control",
      "safety",
      "subcontractor",
      "communication",
      "teamwork",
      "problem solving",
      "time management",
      "technical documentation",
      "progress reports",
      "site inspection",
      "quantity",
      "materials",
      "civil engineering",
      "project schedule",
      "construction methods",
    ];

    const jobKeywords = keywords.filter(
      (keyword) =>
        jobText.includes(keyword)
    );

    const matchedKeywords = jobKeywords.filter(
      (keyword) =>
        cvText.includes(keyword)
    );

    const missingKeywords = jobKeywords.filter(
      (keyword) =>
        !cvText.includes(keyword)
    );

    const matchPercentage =
      jobKeywords.length > 0
        ? Math.round(
            (matchedKeywords.length /
              jobKeywords.length) *
              100
          )
        : 0;

        const keywordScore = matchPercentage * 0.7;

        const skillsText = form.skills.toLowerCase();
        
        const matchedSkills = jobKeywords.filter(
          (keyword) =>
            skillsText.includes(keyword)
        ).length;
        
        const skillsScore =
          jobKeywords.length > 0
            ? (matchedSkills / jobKeywords.length) * 15
            : 0;
        
            const hasExperience = form.experience.some(
              (item) =>
                item.jobTitle.trim() ||
                item.company.trim() ||
                item.description.trim()
            );
            
            const contentScore =
              (form.summary.trim() ? 7.5 : 0) +
              (hasExperience ? 7.5 : 0);
        
        const score = Math.min(
          100,
          Math.round(
            keywordScore +
              skillsScore +
              contentScore
          )
        );

    const recommendations: string[] = [];

    if (missingKeywords.length > 0) {
      recommendations.push(
        `Consider adding relevant keywords: ${missingKeywords
          .slice(0, 5)
          .join(", ")}.`
      );
    }

    if (!form.summary.trim()) {
      recommendations.push(
        "Add a strong professional summary."
      );
    }

    if (
      form.experience.length === 0 ||
      form.experience.every(
        (item) =>
          !item.description.trim() &&
          !item.jobTitle.trim() &&
          !item.company.trim()
      )
    ) {
      recommendations.push(
        "Add measurable work experience and achievements."
      );
    }

    if (!form.skills.trim()) {
      recommendations.push(
        "Add technical and soft skills relevant to the job."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Your CV has a strong keyword match with this job description."
      );
    }

    setAtsAnalysis({
      score,
      matchPercentage,
      matchedKeywords,
      missingKeywords,
      recommendations,
      summary:
        matchPercentage >= 80
          ? "Excellent keyword alignment with the job description."
          : matchPercentage >= 60
          ? "Good match, but there are some areas you can improve."
          : "Your CV needs more job-specific keywords and relevant experience.",
          tailoredSummary: "",
    });
  }

  /* =========================
     TAILOR CV
  ========================= */

  const tailorCV = async () => {
    if (!form.name.trim() || !form.jobTitle.trim()) {
      setTailoredResult(
        "Please enter your name and target job title before using AI tailoring."
      );
      return;
    }
  
    if (!form.jobDescription.trim()) {
      setTailoredResult(
        "Please paste a job description first so the CV can be tailored to the target role."
      );
      return;
    }
  
    setTailoring(true);
    setTailoredResult("");
    setAtsAnalysis(null);
  
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          jobTitle: form.jobTitle,
          summary: form.summary,
          experience: form.experience,
          education: form.education,
          skills: form.skills,
          jobDescription: form.jobDescription,
        }),
      });
  
      let data: any = {};
  
      try {
        data = await response.json();
      } catch {
        data = {};
      }
  
      if (!response.ok) {
        const errorMessage = String(data?.error || "").toLowerCase();
  
        if (
          response.status === 401 ||
          errorMessage.includes("api key") ||
          errorMessage.includes("authentication")
        ) {
          throw new Error(
            "AI tailoring is not configured yet. Please add your OpenAI API key in the .env.local file."
          );
        }
  
        if (
          response.status === 429 ||
          errorMessage.includes("credits") ||
          errorMessage.includes("quota") ||
          errorMessage.includes("billing")
        ) {
          throw new Error(
            "AI tailoring is temporarily unavailable because the OpenAI account has no available credits. Local ATS analysis and PDF export are still available."
          );
        }
  
        throw new Error(
          data?.error ||
            "AI tailoring could not be completed. Please try again later."
        );
      }
  
      if (data?.analysis) {
        setAtsAnalysis(data.analysis);
      }
      
      setTailoredResult(
        data?.result ||
          data?.text ||
          "Your CV was successfully tailored."
      );
    } catch (error: any) {
      console.error("AI tailoring error:", error);
  
      setTailoredResult(
        error?.message ||
          "AI tailoring is currently unavailable. You can still use the local ATS analysis."
      );
    } finally {
      setTailoring(false);
    }
  };

  const improveExperienceWithAI = async (index: number) => {
    const experience = form.experience[index];
  
    if (!experience.description.trim()) {
      setTailoredResult(
        `Please enter a description for Experience ${index + 1} first.`
      );
      return;
    }
  
    if (!form.jobDescription.trim()) {
      setTailoredResult(
        "Please paste a job description first so the experience can be improved for the target role."
      );
      return;
    }
  
    setTailoringExperienceIndex(index);
    setTailoredResult("");
  
    try {
      const response = await fetch("/tailor-experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experience,
          jobTitle: form.jobTitle,
          jobDescription: form.jobDescription,
          skills: form.skills,
        }),
      });
  
      let data: any = {};
  
      try {
        data = await response.json();
      } catch {
        data = {};
      }
  
      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI could not improve this experience description."
        );
      }
  
      if (!data?.result) {
        throw new Error(
          "AI returned an empty improved experience description."
        );
      }
  
      setExperienceAIResult({
        index,
        result: data.result,
      });
      
      setTailoredResult(
        `✨ AI improvement is ready for Experience ${index + 1}.`
      );
    } catch (error: any) {
      console.error("Experience improvement error:", error);
  
      setTailoredResult(
        error?.message ||
          "AI experience improvement is currently unavailable."
      );
    } finally {
      setTailoringExperienceIndex(null);
    }
  };

  const improveEducationWithAI = async (index: number) => {
    const education = form.education[index];
  
    if (
      !education.degree.trim() &&
      !education.institution.trim()
    ) {
      setTailoredResult(
        `Please enter education information for Education ${index + 1} first.`
      );
      return;
    }
  
    if (!form.jobDescription.trim()) {
      setTailoredResult(
        "Please paste a job description first so the education can be improved for the target role."
      );
      return;
    }
  
    setTailoringEducationIndex(index);
    setTailoredResult("");
  
    try {
      const response = await fetch("/tailor-education", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          education,
          jobTitle: form.jobTitle,
          jobDescription: form.jobDescription,
          skills: form.skills,
        }),
      });
  
      let data: any = {};
  
      try {
        data = await response.json();
      } catch {
        data = {};
      }
  
      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI could not improve this education information."
        );
      }
  
      if (!data?.result) {
        throw new Error(
          "AI returned an empty education improvement."
        );
      }
      
      setEducationAIResult({
        index,
        result: data.result,
      });
      
      setTailoredResult(
        `✨ Education ${index + 1} improvement is ready.`
      );
    } catch (error: any) {
      console.error("Education improvement error:", error);
  
      setTailoredResult(
        error?.message ||
          "AI education improvement is currently unavailable."
      );
    } finally {
      setTailoringEducationIndex(null);
    }
  };

  return (
    <main
      className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================
            TOP BAR
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className={`text-3xl font-black ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              CVForge
            </h1>

            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              AI-powered CV Builder
            </p>
          </div>

          <div className="flex items-center gap-3">
  <span
    className={`text-sm ${
      darkMode
        ? "text-slate-400"
        : "text-slate-500"
    }`}
  >
    💾 {saveStatus}
  </span>

  <button
    onClick={clearCV}
    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
      darkMode
        ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
        : "border-red-200 text-red-600 hover:bg-red-50"
    }`}
  >
    🗑️ Clear
  </button>
</div>

        <div className="no-print flex flex-wrap gap-3">
            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              {darkMode
                ? "☀️ Light"
                : "🌙 Dark"}
            </button>

            <button
              onClick={printCV}
              className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              🖨️ Print / PDF
            </button>

            <button
              onClick={generateCV}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >

            
              {loading
                ? "Generating..."
                : "Generate CV"}
            </button>

            
<button
  type="button"
  onClick={() => setIsPro((prev) => !prev)}
  className={`rounded-xl border px-4 py-2 text-sm font-bold ${
    isPro
      ? "border-blue-500 bg-blue-600 text-white"
      : darkMode
      ? "border-slate-700 text-white hover:bg-slate-800"
      : "border-slate-300 text-slate-700 hover:bg-slate-100"
  }`}
>
{isPro ? "⭐ Pro Preview" : "🔒 Free"}
</button>
{/* Sign Out */}  
<button
  type="button"
  onClick={async () => {
    await signOut(auth);
  }}
  className={`rounded-xl border px-4 py-2 text-sm font-bold ${
    darkMode
      ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
      : "border-red-300 text-red-600 hover:bg-red-50"
  }`}
>
  Sign Out
</button>
          </div>
        </div>

        {/* =========================
    CV MANAGER
========================= */}

<div
  className={`mb-6 rounded-2xl p-5 shadow-sm ${
    darkMode
      ? "bg-slate-900"
      : "bg-white"
  }`}
>
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
      <p
        className={`text-xs font-bold uppercase tracking-widest ${
          darkMode
            ? "text-slate-400"
            : "text-slate-500"
        }`}
      >
        Your CVs
      </p>

      <h2
        className={`mt-1 text-lg font-black ${
          darkMode
            ? "text-white"
            : "text-slate-900"
        }`}
      >
        {cvName}
      </h2>
    </div>

    <div className="flex flex-wrap gap-2">
      <select
        value={currentCVId}
        onChange={(e) => {
          const selected = savedCVs.find(
            (cv) => cv.id === e.target.value
          );

          if (!selected) return;

          setCurrentCVId(selected.id);
          setCvName(selected.name);
          setForm(selected.form);
          setTemplate(selected.template);
          setAccentColor(selected.accentColor);
          setAtsAnalysis(null);
          setTailoredResult("");
          setAiResult("");
        }}
        className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none ${
          darkMode
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-slate-200 bg-white text-slate-800"
        }`}
      >
        {savedCVs.map((cv) => (
          <option
            key={cv.id}
            value={cv.id}
          >
            {cv.name}
          </option>
        ))}
      </select>

      <button
  type="button"
  onClick={async () => {
    const name = window.prompt(
      "Enter a name for your new CV:",
      "New CV"
    );

    if (!name?.trim()) return;

    const user = auth.currentUser;

    if (!user) {
      window.alert(
        "You must be signed in to create a new CV."
      );
      return;
    }

    const newCV: SavedCV = {
      id: "cv-" + Date.now(),
      name: name.trim(),
      form: {
        ...emptyForm,
        experience: [...emptyForm.experience],
        education: [...emptyForm.education],
      },
      template: "modern",
      accentColor: "blue",
      updatedAt: Date.now(),
    };

    try {
      await saveCVToFirestore(newCV);

      setSavedCVs((previous) => [
        ...previous,
        newCV,
      ]);

      setCurrentCVId(newCV.id);
      setCvName(newCV.name);
      setForm({
        ...emptyForm,
        experience: [...emptyForm.experience],
        education: [...emptyForm.education],
      });
      setTemplate("modern");
      setAccentColor("blue");
      setAtsAnalysis(null);
      setTailoredResult("");
      setAiResult("");
      setSaveStatus("Saved");

      console.log(
        "New CV created in Firestore."
      );
    } catch (error) {
      console.error(
        "Could not create new CV:",
        error
      );

      window.alert(
        "Could not create the new CV. Please try again."
      );
    }
  }}
  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
>
  + New CV
</button>

<button
  type="button"
  onClick={async () => {
    const newName = window.prompt(
      "Rename this CV:",
      cvName
    );

    if (!newName?.trim()) return;

    const updatedName = newName.trim();
    const user = auth.currentUser;

    if (!user) {
      window.alert(
        "You must be signed in to rename a CV."
      );
      return;
    }

    try {
      const existingCV = savedCVs.find(
        (cv) => cv.id === currentCVId
      );

      if (!existingCV) {
        window.alert(
          "Could not find the selected CV."
        );
        return;
      }

      const updatedCV: SavedCV = {
        ...existingCV,
        name: updatedName,
        updatedAt: Date.now(),
      };

      await saveCVToFirestore(updatedCV);

      setCvName(updatedName);

      setSavedCVs((previous) =>
        previous.map((cv) =>
          cv.id === currentCVId
            ? updatedCV
            : cv
        )
      );

      setSaveStatus("Saved");

      console.log(
        "CV renamed in Firestore."
      );
    } catch (error) {
      console.error(
        "Could not rename CV:",
        error
      );

      window.alert(
        "Could not rename the CV. Please try again."
      );
    }
  }}
  className={`rounded-xl border px-4 py-2 text-sm font-bold ${
    darkMode
      ? "border-slate-700 text-white hover:bg-slate-800"
      : "border-slate-200 text-slate-800 hover:bg-slate-50"
  }`}
>
  ✏️ Rename
</button>

      {savedCVs.length > 1 && (
        <button
        type="button"
        onClick={async () => {
          const confirmed = window.confirm(
            `Delete "${cvName}"?`
          );
      
          if (!confirmed) return;
      
          if (savedCVs.length <= 1) {
            window.alert(
              "You must keep at least one CV."
            );
            return;
          }
      
          const user = auth.currentUser;
      
          if (!user) {
            window.alert(
              "You must be signed in to delete a CV."
            );
            return;
          }
      
          try {
            await deleteDoc(
              doc(
                db,
                "users",
                user.uid,
                "cvs",
                currentCVId
              )
            );
      
            const remaining = savedCVs.filter(
              (cv) => cv.id !== currentCVId
            );
      
            const nextCV = remaining[0];
      
            setSavedCVs(remaining);
      
            setCurrentCVId(nextCV.id);
            setCvName(nextCV.name);
            setForm(nextCV.form);
            setTemplate(nextCV.template);
            setAccentColor(nextCV.accentColor);
            setAtsAnalysis(null);
            setTailoredResult("");
            setAiResult("");
      
            setSaveStatus("Saved");
      
            console.log(
              "CV deleted from Firestore."
            );
          } catch (error) {
            console.error(
              "Could not delete CV:",
              error
            );
      
            window.alert(
              "Could not delete the CV. Please try again."
            );
          }
        }}
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
      >
        🗑️ Delete
      </button>
      )}
    </div>
  </div>
</div>

        <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">

          {/* =========================
              FORM
          ========================= */}

          

          <section
            className={`rounded-2xl p-6 shadow-sm transition-colors ${
              darkMode
                ? "bg-slate-900"
                : "bg-white"
            }`}
          >
            <h2
              className={`mb-6 text-xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Your Information
            </h2>

            <div className="space-y-4">

              {/* BASIC INFO */}

              <input
                value={form.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Full Name"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              <input
                value={form.jobTitle}
                onChange={(e) =>
                  updateField(
                    "jobTitle",
                    e.target.value
                  )
                }
                placeholder="Target Job Title"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              <input
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
                placeholder="Email"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              <input
                value={form.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="Phone"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              <input
                value={form.location}
                onChange={(e) =>
                  updateField(
                    "location",
                    e.target.value
                  )
                }
                placeholder="Location"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              {/* SUMMARY */}

              <textarea
                value={form.summary}
                onChange={(e) =>
                  updateField(
                    "summary",
                    e.target.value
                  )
                }
                placeholder="Professional Summary"
                rows={5}
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              {/* =========================
                  WORK EXPERIENCE
              ========================= */}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Work Experience
                    </h3>

                    <p
                      className={`mt-1 text-xs ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Add your previous jobs and achievements.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addExperience}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    + Add
                  </button>
                </div>

                {form.experience.map(
                  (experience, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl border p-4 ${
                        darkMode
                          ? "border-slate-700 bg-slate-800"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p
                          className={`text-sm font-bold ${
                            darkMode
                              ? "text-white"
                              : "text-slate-800"
                          }`}
                        >
                          Experience {index + 1}
                        </p>

                        {form.experience.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeExperience(
                                index
                              )
                            }
                            className="text-xs font-semibold text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">

                        <input
                          value={
                            experience.jobTitle
                          }
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "jobTitle",
                              e.target.value
                            )
                          }
                          placeholder="Job Title"
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                            darkMode
                              ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                          }`}
                        />

                        <input
                          value={
                            experience.company
                          }
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          placeholder="Company"
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                            darkMode
                              ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                          }`}
                        />

                        <input
                          value={
                            experience.location
                          }
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Location"
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                            darkMode
                              ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                          }`}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={
                              experience.startDate
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            placeholder="Start Date"
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                              darkMode
                                ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                            }`}
                          />

                          <input
                            value={
                              experience.endDate
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            placeholder="End Date"
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                              darkMode
                                ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                            }`}
                          />
                        </div>

                        <textarea
                          value={
                            experience.description
                          }
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Responsibilities & achievements"
                          rows={5}
                          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                            darkMode
                              ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                          }`}
                        />
                        {isPro && (
  <button
    type="button"
    onClick={() => improveExperienceWithAI(index)}
    disabled={tailoringExperienceIndex === index}
    className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {tailoringExperienceIndex === index
      ? "⏳ Improving..."
      : "✨ Improve with AI"}
  </button>
)}

{educationAIResult?.index === index && (
  <div
    className={`mt-4 rounded-2xl border p-4 ${
      darkMode
        ? "border-blue-800 bg-slate-900"
        : "border-blue-200 bg-blue-50"
    }`}
  >
    <p
      className={`mb-2 text-sm font-bold ${
        darkMode ? "text-white" : "text-slate-800"
      }`}
    >
      ✨ AI Education Improvement
    </p>

    <div
      className={`whitespace-pre-line text-sm leading-6 ${
        darkMode ? "text-slate-200" : "text-slate-700"
      }`}
    >
      {educationAIResult.result}
    </div>

    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={() => {
          setForm((previous) => ({
            ...previous,
            education: previous.education.map(
              (item, itemIndex) =>
                itemIndex === index
                  ? {
                      ...item,
                      details: educationAIResult.result,
                    }
                  : item
            ),
          }));
        
          setEducationAIResult(null);
        
          setTailoredResult(
            `✨ Education ${index + 1} updated with AI.`
          );
        }}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        ✓ Apply
      </button>

      <button
        type="button"
        onClick={() => {
          setEducationAIResult(null);
        }}
        className={`rounded-xl border px-4 py-2 text-sm font-bold ${
          darkMode
            ? "border-slate-700 text-white hover:bg-slate-800"
            : "border-slate-300 text-slate-700 hover:bg-white"
        }`}
      >
        Cancel
      </button>
    </div>
  </div>
)}

{experienceAIResult?.index === index && (
  <div
    className={`mt-4 rounded-2xl border p-4 ${
      darkMode
        ? "border-blue-800 bg-slate-900"
        : "border-blue-200 bg-blue-50"
    }`}
  >
    <p
      className={`mb-2 text-sm font-bold ${
        darkMode ? "text-white" : "text-slate-800"
      }`}
    >
      ✨ AI Improved Version
    </p>

    <div
      className={`whitespace-pre-line text-sm leading-6 ${
        darkMode ? "text-slate-200" : "text-slate-700"
      }`}
    >
      {experienceAIResult.result}
    </div>

    <div className="mt-4 flex gap-3">
      <button
        type="button"
        onClick={() => {
          setForm((previous) => ({
            ...previous,
            experience: previous.experience.map(
              (item, itemIndex) =>
                itemIndex === index
                  ? {
                      ...item,
                      description:
                        experienceAIResult.result,
                    }
                  : item
            ),
          }));

          setExperienceAIResult(null);
          setTailoredResult(
            `✨ Experience ${index + 1} updated with AI.`
          );
        }}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        ✓ Apply
      </button>

      <button
        type="button"
        onClick={() => {
          setExperienceAIResult(null);
        }}
        className={`rounded-xl border px-4 py-2 text-sm font-bold ${
          darkMode
            ? "border-slate-700 text-white hover:bg-slate-800"
            : "border-slate-300 text-slate-700 hover:bg-white"
        }`}
      >
        Cancel
      </button>
    </div>
  </div>
)}

                      </div>
                    </div>
                  )
                )}
              </div>

              {/* =========================
                  EDUCATION
              ========================= */}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Education
                    </h3>

                    <p
                      className={`mt-1 text-xs ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Add your education and qualifications.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addEducation}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    + Add
                  </button>
                </div>

                {form.education.map((education, index) => (
  <div
    key={index}
    className={`rounded-2xl border p-4 ${
      darkMode
        ? "border-slate-700 bg-slate-800"
        : "border-slate-200 bg-slate-50"
    }`}
  >
    <div className="mb-4 flex items-center justify-between">
      <p
        className={`text-sm font-bold ${
          darkMode ? "text-white" : "text-slate-800"
        }`}
      >
        Education {index + 1}
      </p>

      {form.education.length > 1 && (
        <button
          type="button"
          onClick={() => removeEducation(index)}
          className="text-xs font-semibold text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      )}
    </div>

    <div className="space-y-3">
      <input
        value={education.degree}
        onChange={(e) =>
          updateEducation(index, "degree", e.target.value)
        }
        placeholder="Degree / Qualification"
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
        }`}
      />

      <input
        value={education.institution}
        onChange={(e) =>
          updateEducation(index, "institution", e.target.value)
        }
        placeholder="Institution"
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
        }`}
      />

      <input
        value={education.location}
        onChange={(e) =>
          updateEducation(index, "location", e.target.value)
        }
        placeholder="Location"
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
        }`}
      />

      <input
        value={education.graduationYear}
        onChange={(e) =>
          updateEducation(
            index,
            "graduationYear",
            e.target.value
          )
        }
        placeholder="Graduation Year"
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
        }`}
      />

<textarea
  value={education.details || ""}
  onChange={(e) =>
    updateEducation(
      index,
      "details",
      e.target.value
    )
  }
  placeholder="Relevant coursework, achievements, projects, or qualifications"
  rows={4}
  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
    darkMode
      ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
  }`}
/>

      {isPro && (
        <button
          type="button"
          onClick={() => improveEducationWithAI(index)}
          disabled={tailoringEducationIndex === index}
          className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {tailoringEducationIndex === index
            ? "⏳ Improving..."
            : "✨ Improve with AI"}
        </button>
      )}
    </div>
  </div>
))}
              </div>

              {/* =========================
                  SKILLS
              ========================= */}

              <textarea
                value={form.skills}
                onChange={(e) =>
                  updateField(
                    "skills",
                    e.target.value
                  )
                }
                placeholder="Skills (e.g. AutoCAD, Excel, Project Management)"
                rows={4}
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-white"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                }`}
              />

              {/* =========================
                  ATS
              ========================= */}

              <button
                onClick={analyzeATS}
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Analyze ATS Score
              </button>

              {/* =========================
                  TAILOR CV
              ========================= */}

              <div
                className={`mt-6 rounded-2xl border p-5 ${
                  darkMode
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <h3
                  className={`mb-2 text-lg font-bold ${
                    darkMode
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  🎯 Tailor Your CV
                </h3>

                <p
                  className={`mb-4 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Paste the job description and CVForge will help optimize your CV for the role.
                </p>

                <textarea
                  value={form.jobDescription}
                  onChange={(e) =>
                    updateField(
                      "jobDescription",
                      e.target.value
                    )
                  }
                  placeholder="Paste the job description here..."
                  rows={8}
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    darkMode
                      ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-white"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-900"
                  }`}
                />

                <button
                  onClick={tailorCV}
                  disabled={tailoring}
                  className="mt-3 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {tailoring ? "Tailoring..." : "Tailor CV with AI"}
                </button>
              </div>
            </div>
          </section>

          {/* =========================
              PREVIEW
          ========================= */}

          <section>

            {/* TEMPLATE SELECTOR */}

<div className="grid grid-cols-1 gap-4 md:grid-cols-3">

{/* MODERN */}
<button
  onClick={() => setTemplate("modern")}
  className={`group rounded-2xl border-2 p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
    template === "modern"
      ? "border-slate-900 bg-slate-50 shadow-md"
      : "border-slate-200 bg-white hover:border-slate-400"
  }`}
>
  {/* Preview */}
  <div className="mb-4 h-32 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex h-full">

      {/* Sidebar */}
      <div className="w-[30%] bg-slate-950 p-2">
        <div className="mx-auto mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[8px] font-bold text-slate-900">
          JD
        </div>

        <div className="mb-2 h-1 w-3/4 rounded bg-slate-500" />
        <div className="mb-1 h-1 w-full rounded bg-slate-700" />
        <div className="mb-1 h-1 w-5/6 rounded bg-slate-700" />

        <div className="mt-4 h-1 w-1/2 rounded bg-white" />
        <div className="mt-2 h-1 w-full rounded bg-slate-700" />
        <div className="mt-1 h-1 w-4/5 rounded bg-slate-700" />
      </div>

      {/* Main */}
      <div className="flex-1 p-3">
        <div className="h-3 w-3/5 rounded bg-slate-900" />
        <div className="mt-1 h-1 w-2/5 rounded bg-slate-400" />

        <div className="mt-5 h-1 w-1/4 rounded bg-slate-900" />
        <div className="mt-2 h-1 w-full rounded bg-slate-200" />
        <div className="mt-1 h-1 w-5/6 rounded bg-slate-200" />

        <div className="mt-4 h-1 w-1/3 rounded bg-slate-900" />
        <div className="mt-2 h-1 w-full rounded bg-slate-200" />
        <div className="mt-1 h-1 w-4/5 rounded bg-slate-200" />
      </div>

    </div>
  </div>

  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-bold text-slate-900">
        Modern
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Creative sidebar layout
      </p>
    </div>

    {template === "modern" && (
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">
        Selected
      </span>
    )}
  </div>
</button>


{/* EXECUTIVE */}
<button
  onClick={() => setTemplate("executive")}
  className={`group rounded-2xl border-2 p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
    template === "executive"
      ? "border-slate-900 bg-slate-50 shadow-md"
      : "border-slate-200 bg-white hover:border-slate-400"
  }`}
>
  {/* Preview */}
  <div className="mb-4 h-32 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

    <div className="bg-slate-950 px-3 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-24 rounded bg-white" />
          <div className="mt-1 h-1 w-16 rounded bg-slate-400" />
        </div>

        <div className="space-y-1">
          <div className="h-1 w-12 rounded bg-slate-500" />
          <div className="h-1 w-10 rounded bg-slate-500" />
        </div>
      </div>
    </div>

    <div className="p-3">

      <div className="mb-2 h-1 w-1/4 rounded bg-slate-900" />

      <div className="h-1 w-full rounded bg-slate-200" />
      <div className="mt-1 h-1 w-5/6 rounded bg-slate-200" />

      <div className="mt-4 h-1 w-1/3 rounded bg-slate-900" />

      <div className="mt-2 h-1 w-full rounded bg-slate-200" />
      <div className="mt-1 h-1 w-4/5 rounded bg-slate-200" />

      <div className="mt-3 flex gap-3">
        <div className="h-1 w-1/3 rounded bg-slate-300" />
        <div className="h-1 w-1/3 rounded bg-slate-300" />
      </div>

    </div>
  </div>

  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-bold text-slate-900">
        Executive
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Corporate leadership layout
      </p>
    </div>

    {template === "executive" && (
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">
        Selected
      </span>
    )}
  </div>
</button>


{/* MINIMAL */}
<button
  onClick={() => setTemplate("minimal")}
  className={`group rounded-2xl border-2 p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
    template === "minimal"
      ? "border-slate-900 bg-slate-50 shadow-md"
      : "border-slate-200 bg-white hover:border-slate-400"
  }`}
>
  {/* Preview */}
  <div className="mb-4 h-32 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

    <div className="h-3 w-2/5 rounded bg-black" />
    <div className="mt-2 h-1 w-1/3 rounded bg-slate-400" />

    <div className="mt-4 border-b border-slate-900 pb-1">
      <div className="h-1 w-1/4 rounded bg-black" />
    </div>

    <div className="mt-3 h-1 w-full rounded bg-slate-200" />
    <div className="mt-1 h-1 w-5/6 rounded bg-slate-200" />
    <div className="mt-1 h-1 w-4/5 rounded bg-slate-200" />

    <div className="mt-4 border-b border-slate-900 pb-1">
      <div className="h-1 w-1/5 rounded bg-black" />
    </div>

  </div>

  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-bold text-slate-900">
        ATS Minimal
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Clean & ATS-friendly
      </p>
    </div>

    {template === "minimal" && (
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">
        Selected
      </span>
    )}
  </div>
</button>

</div>

{/* ACCENT COLORS */}

<div className="mt-6 border-t border-slate-200 pt-5">
  <div className="mb-3">
    <p className="text-sm font-bold text-slate-900">
      Accent Color
    </p>

    <p className="text-xs text-slate-500">
      Choose a color for your CV design
    </p>
  </div>

  <div className="flex flex-wrap gap-3">

    {[
      {
        name: "blue",
        label: "Blue",
        className: "bg-blue-600",
      },
      {
        name: "purple",
        label: "Purple",
        className: "bg-purple-600",
      },
      {
        name: "green",
        label: "Green",
        className: "bg-emerald-600",
      },
      {
        name: "red",
        label: "Red",
        className: "bg-red-600",
      },
      {
        name: "orange",
        label: "Orange",
        className: "bg-orange-500",
      },
      {
        name: "black",
        label: "Black",
        className: "bg-slate-950",
      },
    ].map((color) => (
      <button
        key={color.name}
        type="button"
        onClick={() =>
          setAccentColor(
            color.name as AccentColor
          )
        }
        title={color.label}
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
          accentColor === color.name
            ? "border-slate-900 ring-2 ring-slate-300"
            : "border-transparent hover:scale-110"
        }`}
      >
        <span
          className={`h-6 w-6 rounded-full ${color.className}`}
        />
      </button>
    ))}

  </div>
</div>

            {/* =========================
                ATS RESULT
            ========================= */}

            {atsAnalysis && (
              <div
                className={`mb-6 rounded-2xl p-6 shadow-sm ${
                  darkMode
                    ? "bg-slate-900"
                    : "bg-white"
                }`}
              >
                <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      ATS Resume Analysis
                    </p>

                    <h2
                      className={`mt-1 text-3xl font-black ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {atsAnalysis.score}/100
                    </h2>

                    <p
  className={`mt-1 text-sm font-medium ${
    atsAnalysis.score >= 80
      ? "text-emerald-600"
      : atsAnalysis.score >= 60
      ? "text-yellow-600"
      : "text-red-600"
  }`}
>
{atsAnalysis.score >= 80
  ? "Strong keyword alignment"
  : atsAnalysis.score >= 60
  ? "Some improvements recommended"
  : "More job-specific keywords may help"}
</p>
                  </div>

                  <div
  className={`rounded-2xl border px-5 py-4 text-center ${
    darkMode
      ? "border-slate-700 bg-slate-800"
      : "border-slate-200 bg-white"
  }`}
>
  <p
    className={`text-xs font-medium ${
      darkMode
        ? "text-slate-400"
        : "text-slate-500"
    }`}
  >
    Job Match
  </p>

  <p
    className={`text-2xl font-black ${
      darkMode
        ? "text-white"
        : "text-slate-900"
    }`}
  >
    {atsAnalysis.matchPercentage}%
  </p>
</div>
                </div>

                <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200">
  <div
    className={`h-full rounded-full transition-all duration-700 ${
      atsAnalysis.score >= 80
        ? "bg-emerald-500"
        : atsAnalysis.score >= 60
        ? "bg-yellow-500"
        : "bg-red-500"
    }`}
    style={{
      width: `${atsAnalysis.score}%`,
    }}
  />
</div>

                <div className="grid gap-6 md:grid-cols-2">

                  {/* MATCHED */}

                  <div>
                    <h3
                      className={`mb-3 font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      ✅ Matching Keywords
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {atsAnalysis.matchedKeywords
                        .length > 0 ? (
                        atsAnalysis.matchedKeywords.map(
                          (keyword, index) => (
                            <span
                              key={index}
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                darkMode
                                  ? "bg-slate-800 text-slate-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {keyword}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-sm text-slate-500">
                          No matching keywords found.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* MISSING */}

                  <div>
                    <h3
                      className={`mb-3 font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      ⚠️ Missing Keywords
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {atsAnalysis.missingKeywords
                        .length > 0 ? (
                        atsAnalysis.missingKeywords.map(
                          (keyword, index) => (
                            <span
                              key={index}
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                darkMode
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {keyword}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-sm text-slate-500">
                          No major missing keywords.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* RECOMMENDATIONS */}

                <div className="mt-6">
                  <h3
                    className={`mb-3 font-bold ${
                      darkMode
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    💡 Recommendations
                  </h3>

                  <div className="space-y-3">
  {atsAnalysis.recommendations.map(
    (item, index) => (
      <div
        key={index}
        className={`rounded-xl border px-4 py-3 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`text-sm leading-6 ${
            darkMode
              ? "text-slate-300"
              : "text-slate-600"
          }`}
        >
          <span className="mr-2 font-bold">
            {index + 1}.
          </span>
          {item}
        </p>
      </div>
    )
  )}
</div>
                </div>

                <p
                  className={`mt-6 border-t pt-5 text-sm leading-6 ${
                    darkMode
                      ? "border-slate-800 text-slate-400"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {atsAnalysis.summary}
                </p>
              </div>
            )}

            {/* =========================
                CV PAPER
            ========================= */}

<div className="cv-print-area mx-auto w-full max-w-[794px] rounded-sm bg-white shadow-2xl">
  <div className={`cv-preview-wrapper overflow-auto rounded-2xl ${
    darkMode ? "bg-slate-800 p-4 md:p-8" : "bg-slate-300 p-4 md:p-8"
  }`}>

    {template === "modern" && (
      <ModernTemplate
        form={form}
        accentColor={accentColor}
      />
    )}

    {template === "executive" && (
      <ExecutiveTemplate
        form={form}
        accentColor={accentColor}
      />
    )}

    {template === "minimal" && (
      <MinimalTemplate
        form={form}
        accentColor={accentColor}
      />
    )}
  </div>
</div>

            {/* =========================
                TAILORED RESULT
            ========================= */}

{tailoredResult && (
  <div
    className={`mt-6 rounded-2xl p-6 shadow-sm ${
      darkMode ? "bg-slate-900" : "bg-white"
    }`}
  >
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          🎯 AI Job Match Analysis
        </h2>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          See how well your CV matches the target job.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 px-4 py-2 text-center dark:bg-blue-950/40">
        <div className="text-2xl font-black text-blue-600">
          {atsAnalysis?.score ?? "--"}
        </div>
        <div className="text-xs font-bold text-blue-600">
          ATS SCORE
        </div>
      </div>
    </div>

    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <div
        className={`rounded-xl border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`text-xs font-bold uppercase ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Job Match
        </p>

        <p className="mt-2 text-3xl font-black text-blue-600">
          {atsAnalysis?.matchPercentage ?? "--"}%
        </p>
      </div>

      <div
        className={`rounded-xl border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`text-xs font-bold uppercase ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Matched Keywords
        </p>

        <p className="mt-2 text-3xl font-black text-emerald-600">
          {atsAnalysis?.matchedKeywords?.length ?? 0}
        </p>
      </div>

      <div
        className={`rounded-xl border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`text-xs font-bold uppercase ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Missing Keywords
        </p>

        <p className="mt-2 text-3xl font-black text-red-500">
          {atsAnalysis?.missingKeywords?.length ?? 0}
        </p>
      </div>
    </div>

    <div
  className={`mb-5 rounded-xl px-4 py-3 text-sm ${
    darkMode
      ? "bg-slate-800 text-slate-300"
      : "bg-slate-50 text-slate-600"
  }`}
>
  <span className="font-bold">
    {atsAnalysis?.matchedKeywords.length}
  </span>{" "}
  keywords matched{" "}
  <span className="mx-1">•</span>{" "}
  <span className="font-bold">
    {atsAnalysis?.missingKeywords.length}
  </span>{" "}
  keywords missing
</div>

    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3
          className={`mb-3 font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          ✅ Matched Keywords
        </h3>

        <div className="flex flex-wrap gap-2">
          {atsAnalysis?.matchedKeywords?.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3
          className={`mb-3 font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          ⚠️ Missing Keywords
        </h3>

        <div className="flex flex-wrap gap-2">
          {atsAnalysis?.missingKeywords?.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6">
      <h3
        className={`mb-3 font-bold ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        💡 AI Recommendations
      </h3>

      <div className="space-y-3">
        {atsAnalysis?.recommendations?.map((recommendation, index) => (
          <div
            key={index}
            className={`rounded-xl border p-4 text-sm leading-6 ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-slate-300"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {recommendation}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <h3
        className={`mb-3 font-bold ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        📝 AI Summary
      </h3>

      <div
        className={`rounded-xl border p-4 text-sm leading-6 ${
          darkMode
            ? "border-slate-700 bg-slate-800 text-slate-300"
            : "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        {atsAnalysis?.summary || "No summary available."}
      </div>
      <div className="mt-6">
  <h3
    className={`mb-3 font-bold ${
      darkMode ? "text-white" : "text-slate-900"
    }`}
  >
    ✨ Tailored CV Summary
  </h3>

  <div
    className={`rounded-xl border p-4 text-sm leading-6 ${
      darkMode
        ? "border-blue-800 bg-blue-950/30 text-slate-200"
        : "border-blue-200 bg-blue-50 text-slate-700"
    }`}
  >
    {atsAnalysis?.tailoredSummary ||
      "No tailored summary available."}
  </div>
  {atsAnalysis?.tailoredSummary && (
  <button
    type="button"
    onClick={() => {
      setForm((previous) => ({
        ...previous,
        summary: atsAnalysis.tailoredSummary,
      }));
      setTailoredResult("✨ Tailored summary applied to your CV.");
    }}
    className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
  >
    ✨ Apply to CV
  </button>
)}
</div>
    </div>
  </div>
)}

            {/* =========================
                GENERATED RESULT
            ========================= */}

            {aiResult && (
              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 font-bold text-slate-900">
                  Generated Content
                </h2>

                <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {aiResult}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function BuilderPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading CV Builder...</div>}>
        <BuilderPageContent />
      </Suspense>
    </AuthGuard>
  );
}

