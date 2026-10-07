export default function PrivacyPage() {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <a
              href="/"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to CVForge
            </a>
  
            <h1 className="mt-6 text-4xl font-bold tracking-tight">
              Privacy Policy
            </h1>
  
            <p className="mt-3 text-sm text-slate-500">
              Last updated: October 6, 2026
            </p>
          </div>
  
          <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <section className="space-y-8 text-[15px] leading-7 text-slate-700">
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  1. Information We Collect
                </h2>
                <p>
                  When you use CVForge, we may collect information that you
                  provide directly, including your name, email address, phone
                  number, location, job title, professional summary, work
                  experience, education information, skills, job descriptions,
                  and other CV-related information.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  2. How We Use Your Information
                </h2>
                <p>We use collected information to:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Create and manage your CVs.</li>
                  <li>Provide CV templates and formatting features.</li>
                  <li>Provide AI-assisted CV improvement features.</li>
                  <li>Provide ATS-related analysis features.</li>
                  <li>Save and restore your CVs.</li>
                  <li>Authenticate and manage your account.</li>
                  <li>Provide customer support.</li>
                  <li>Maintain and improve CVForge.</li>
                </ul>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  3. AI Features
                </h2>
                <p>
                  Some CVForge features use artificial intelligence to help
                  improve CV content or analyze information provided for CV and
                  ATS-related purposes.
                </p>
                <p className="mt-3">
                  Information necessary to provide an AI feature may be
                  processed by the services used to operate that functionality.
                </p>
                <p className="mt-3">
                  You are responsible for reviewing AI-generated content before
                  using it in professional documents.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  4. How We Store Your Information
                </h2>
                <p>
                  CVForge may use third-party infrastructure and services,
                  including Firebase, to provide authentication, database, and
                  related functionality.
                </p>
                <p className="mt-3">
                  We take reasonable measures to protect information associated
                  with your account and CVs. However, no online service can
                  guarantee complete security.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  5. CV Information
                </h2>
                <p>
                  Your CV may contain personal and professional information. You
                  should only enter information that you are comfortable storing
                  and processing through CVForge.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  6. Local Storage
                </h2>
                <p>
                  CVForge may use browser storage technologies such as local
                  storage to remember certain CV or application preferences.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  7. Third-Party Services
                </h2>
                <p>
                  CVForge may rely on third-party services for authentication,
                  database infrastructure, hosting, AI functionality, and
                  payment processing where applicable.
                </p>
                <p className="mt-3">
                  These providers may process information according to their own
                  privacy policies and terms.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  8. Data Retention
                </h2>
                <p>
                  We retain information for as long as reasonably necessary to
                  provide the service, maintain your account, comply with legal
                  obligations, resolve disputes, and enforce our agreements.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  9. Your Choices
                </h2>
                <p>Depending on the available features, you may be able to:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Access or update your account information.</li>
                  <li>Edit or delete your saved CVs.</li>
                  <li>Choose whether to use AI features.</li>
                  <li>Delete your account.</li>
                </ul>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  10. Children&apos;s Privacy
                </h2>
                <p>
                  CVForge is not intended for children under the age required by
                  applicable law to independently use online services.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  11. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time as CVForge
                  develops or as legal requirements change.
                </p>
              </div>
  
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  12. Contact
                </h2>
                <p>
                  If you have questions about this Privacy Policy or how CVForge
                  handles information, please contact the CVForge team through
                  the contact information provided on the website.
                </p>
              </div>
  
              <div className="border-t border-slate-200 pt-6">
                <p className="font-medium text-slate-900">
                  By using CVForge, you acknowledge that you have read and
                  understood this Privacy Policy.
                </p>
              </div>
            </section>
          </div>
  
          <footer className="mt-8 text-center text-sm text-slate-500">
            © 2026 CVForge. All rights reserved.
          </footer>
        </div>
      </main>
    );
  }