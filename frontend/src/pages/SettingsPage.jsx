import React from 'react';
import { Package, CheckSquare, Users, Calendar, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, label }) => (
  <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
          <Package size={22} />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-black">{title}</div>
          <div className="text-2xl font-black text-slate-900">{value}</div>
        </div>
      </div>
      {label && <div className="text-xs text-emerald-600 font-black bg-emerald-50 px-2 py-1 rounded-full">{label}</div>}
    </div>
  </div>
);

const RecentActivity = ({ items }) => (
  <div className="bg-white rounded-2xl border p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-black text-slate-900">Recent Activity</h4>
      <button className="text-sm bg-slate-100 px-3 py-1 rounded-lg font-bold">Show All</button>
    </div>
    <ul className="space-y-4">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">{it.userInitials}</div>
          <div>
            <div className="text-sm"><strong className="font-black text-slate-800">{it.user}</strong> {it.action} <span className="text-brand underline">{it.target}</span></div>
            <div className="text-xs text-slate-400 mt-1">{it.when}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Overdue = ({ items }) => (
  <div className="bg-white rounded-2xl border p-6 shadow-sm">
    <h4 className="font-black text-rose-600 mb-4">Overdue</h4>
    {items.length === 0 ? (
      <div className="p-6 rounded-2xl bg-rose-50 text-rose-700">No overdue tasks</div>
    ) : (
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id} className="p-3 rounded-lg border bg-white/50 flex items-center justify-between">
            <div>
              <div className="font-bold">{t.title}</div>
              <div className="text-xs text-slate-400">{t.project} • Due {t.due}</div>
            </div>
            <div className="text-rose-600 font-black">{t.days}d</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const SettingsPage = () => {
  const { logout } = useAuth();
  const stats = [
    { title: 'Total Projects', value: 2, label: '+2 new' },
    { title: 'Active Tasks', value: 12, label: 'In progress' },
    { title: 'Completed', value: 45, label: '+12% growth' },
    { title: 'Team Members', value: 4, label: 'Active now' }
  ];

  const recent = [
    { userInitials: 'U1', user: 'User 1', action: 'updated task', target: 'Integrate Stripe API', when: '2h ago' },
    { userInitials: 'U2', user: 'User 2', action: 'moved task', target: 'Landing page design', when: '5h ago' }
  ];

  const overdue = [];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400 font-medium">February 23, 2026</div>
          <h1 className="text-5xl font-black text-slate-900">System Overview</h1>
          <p className="text-slate-500 mt-2">Monitor your organization's performance, team velocity, and project health in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-slate-100 font-bold">Export</button>
          <button className="px-4 py-2 rounded-lg bg-brand text-white font-black">New Report</button>
          <button onClick={logout} className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 font-black">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (<StatCard key={s.title} {...s} />))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity items={recent} />
        </div>
        <div>
          <Overdue items={overdue} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h4 className="font-black mb-3">Project Settings</h4>
          <p className="text-sm text-slate-500">Configure project templates, workflows, and integrations.</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center justify-between">
              <div>
                <div className="font-bold">Workflows</div>
                <div className="text-xs text-slate-400">To Do → In Progress → Review → Done</div>
              </div>
              <button className="px-3 py-1 rounded-lg bg-slate-100 font-bold">Edit</button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <div className="font-bold">Issue Types</div>
                <div className="text-xs text-slate-400">Task, Bug, Story, Epic</div>
              </div>
              <button className="px-3 py-1 rounded-lg bg-slate-100 font-bold">Manage</button>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h4 className="font-black mb-3">Team & Members</h4>
          <p className="text-sm text-slate-500">Invite and manage team members, roles and permissions.</p>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-brand text-white font-black">Invite</button>
            <button className="px-3 py-2 rounded-lg bg-slate-100 font-bold">Manage</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h4 className="font-black mb-3">Integrations</h4>
          <p className="text-sm text-slate-500">Connect external tools like Jira, Trello, Slack.</p>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-sky-100 text-sky-700 font-black">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
