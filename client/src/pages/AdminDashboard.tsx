import { useState } from "react";
import { useCompanies, useCreateCompany, useCreatePlacementEvent, useCreateMaterial } from "@/hooks/use-placement";
import { Plus, Building, FileText, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { mutate: createCompany, isPending: companyPending } = useCreateCompany();
  const { mutate: createEvent, isPending: eventPending } = useCreatePlacementEvent();
  const { mutate: createMaterial, isPending: materialPending } = useCreateMaterial();

  const [activeTab, setActiveTab] = useState<"company" | "event" | "material">("company");

  // Forms state
  const [companyForm, setCompanyForm] = useState({ name: "", roles: "", eligibility: "", packageInfo: "", selectionProcess: "" });
  const [eventForm, setEventForm] = useState({ companyId: "", date: "", deadline: "", role: "" });
  const [materialForm, setMaterialForm] = useState({ title: "", category: "Aptitude", role: "General", link: "", tags: "" });

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany({
      ...companyForm,
      roles: companyForm.roles.split(',').map(s => s.trim())
    }, { onSuccess: () => setCompanyForm({ name: "", roles: "", eligibility: "", packageInfo: "", selectionProcess: "" }) });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent({
      companyId: eventForm.companyId,
      date: new Date(eventForm.date),
      deadline: new Date(eventForm.deadline),
      role: eventForm.role
    }, { onSuccess: () => setEventForm({ companyId: "", date: "", deadline: "", role: "" }) });
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMaterial({
      ...materialForm,
      tags: materialForm.tags.split(',').map(s => s.trim())
    }, { onSuccess: () => setMaterialForm({ title: "", category: "Aptitude", role: "General", link: "", tags: "" }) });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-foreground text-background p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" /> Admin Control Center
        </h1>
        <p className="mt-2 text-background/70">Manage companies, schedule drives, and upload study materials.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {[
          { id: "company", label: "Add Company", icon: Building },
          { id: "event", label: "Schedule Drive", icon: Calendar },
          { id: "material", label: "Upload Material", icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">

        {/* COMPANY FORM */}
        {activeTab === "company" && (
          <form onSubmit={handleCompanySubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6">Company Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input required className="rounded-xl h-11" placeholder="e.g. Google" value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Roles Offered (comma separated)</Label>
                <Input required className="rounded-xl h-11" placeholder="SWE, Data Analyst" value={companyForm.roles} onChange={e => setCompanyForm({ ...companyForm, roles: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Package Details</Label>
                <Input required className="rounded-xl h-11" placeholder="e.g. 15 LPA" value={companyForm.packageInfo} onChange={e => setCompanyForm({ ...companyForm, packageInfo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Eligibility Criteria</Label>
                <Input required className="rounded-xl h-11" placeholder="e.g. B.Tech CS, > 8 CGPA" value={companyForm.eligibility} onChange={e => setCompanyForm({ ...companyForm, eligibility: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Selection Process</Label>
              <Textarea required className="rounded-xl min-h-[100px]" placeholder="1. Online Test, 2. Tech Interview..." value={companyForm.selectionProcess} onChange={e => setCompanyForm({ ...companyForm, selectionProcess: e.target.value })} />
            </div>
            <Button type="submit" disabled={companyPending} className="w-full rounded-xl h-12 text-md mt-4 shadow-lg shadow-primary/20">
              {companyPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5 mr-2" /> Add Company</>}
            </Button>
          </form>
        )}

        {/* EVENT FORM */}
        {activeTab === "event" && (
          <form onSubmit={handleEventSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6">Schedule Placement Drive</h2>
            {companiesLoading ? <p>Loading companies...</p> : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Select Company</Label>
                  <select required className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" value={eventForm.companyId} onChange={e => setEventForm({ ...eventForm, companyId: e.target.value })}>
                    <option value="">Select a company...</option>
                    {companies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Role specific to drive</Label>
                  <Input required className="rounded-xl h-11" placeholder="Software Engineer" value={eventForm.role} onChange={e => setEventForm({ ...eventForm, role: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Drive Date</Label>
                    <Input type="datetime-local" required className="rounded-xl h-11" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Application Deadline</Label>
                    <Input type="datetime-local" required className="rounded-xl h-11" value={eventForm.deadline} onChange={e => setEventForm({ ...eventForm, deadline: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" disabled={eventPending} className="w-full rounded-xl h-12 text-md shadow-lg shadow-primary/20">
                  {eventPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Calendar className="w-5 h-5 mr-2" /> Schedule Event</>}
                </Button>
              </div>
            )}
          </form>
        )}

        {/* MATERIAL FORM */}
        {activeTab === "material" && (
          <form onSubmit={handleMaterialSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-6">Upload Study Resource</h2>
            <div className="space-y-2">
              <Label>Resource Title</Label>
              <Input required className="rounded-xl h-11" placeholder="Advanced Graphs Sheet" value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" value={materialForm.category} onChange={e => setMaterialForm({ ...materialForm, category: e.target.value })}>
                  <option>Aptitude</option>
                  <option>Coding</option>
                  <option>System Design</option>
                  <option>Interview Prep</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Input required className="rounded-xl h-11" placeholder="SDE, Data Science" value={materialForm.role} onChange={e => setMaterialForm({ ...materialForm, role: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>External Link (URL)</Label>
              <Input type="url" required className="rounded-xl h-11" placeholder="https://..." value={materialForm.link} onChange={e => setMaterialForm({ ...materialForm, link: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input required className="rounded-xl h-11" placeholder="graphs, algorithms, hard" value={materialForm.tags} onChange={e => setMaterialForm({ ...materialForm, tags: e.target.value })} />
            </div>
            <Button type="submit" disabled={materialPending} className="w-full rounded-xl h-12 text-md mt-4 shadow-lg shadow-primary/20">
              {materialPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-5 h-5 mr-2" /> Upload Resource</>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
// Quick icon
function ShieldAlert(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>; }
