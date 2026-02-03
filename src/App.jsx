import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Phone,
  Calendar,
  Pill,
  FileText,
  UserPlus,
  XCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Filter
} from 'lucide-react';

const MOCK_VOICEMAILS = [
  {
    id: 'vm_001',
    timestamp: '2026-02-03T07:42:00Z',
    caller_name: 'Sarah Mitchell',
    duration: 87,
    transcript:
      "Hi, this is Sarah Mitchell calling for my mum, Margaret Chen. She's been a patient there for years. Um, she woke up this morning with really severe chest pain and shortness of breath. She's 78 and has a history of heart problems. I'm really worried and I don't know if we should go to emergency or try to get an appointment today. Can someone please call me back as soon as possible? My number is 0412 345 678. Thanks.",
    urgency: 'critical',
    patient_name: 'Margaret Chen',
    key_details: ['chest pain', 'shortness of breath', 'age 78', 'cardiac history'],
    recommended_action: 'immediate_callback',
    category: 'medical_emergency',
    callback_number: '+61412345678',
    summary:
      'Daughter calling re 78yo mother with severe chest pain, SOB, cardiac history. Requires immediate triage.'
  },
  {
    id: 'vm_003',
    timestamp: '2026-02-03T05:33:00Z',
    caller_name: 'Emma Bradley',
    duration: 112,
    transcript:
      "Hello, this is Emma Bradley. I'm calling because my 6-year-old son Tyler has had a fever for three days now. It started at around 38 degrees but this evening it's gone up to 39.5. He's also complaining of a sore throat and he's not eating. I gave him paracetamol but it's not really helping much. I'm not sure if this is just a virus or if I should bring him in. He does have asthma so I'm a bit concerned. Could someone please call me back this morning? My number is 0387 654 321. Thank you.",
    urgency: 'high',
    patient_name: 'Tyler Bradley',
    key_details: ['fever 39.5°C for 3 days', 'sore throat', 'not eating', 'has asthma', 'age 6'],
    recommended_action: 'priority_callback',
    category: 'sick_child',
    callback_number: '+61387654321',
    summary:
      'Mother calling re 6yo with 3-day fever (39.5°C), sore throat, not eating. Child has asthma. Needs same-day assessment.'
  },
  {
    id: 'vm_006',
    timestamp: '2026-02-03T02:47:00Z',
    caller_name: 'Robert Garcia',
    duration: 95,
    transcript:
      "Hello, this is Robert Garcia. I'm calling because I ran out of my blood pressure medication two days ago and I forgot to request a repeat. I usually take Perindopril 5mg. I've been a patient at the Sunset location for about five years. I know I should have called earlier but is there any way I can get an urgent script? I'm happy to pick it up today. My pharmacy is the Chemist Warehouse on Main Street. Please call me back on 0434 567 890. Thank you.",
    urgency: 'high',
    patient_name: 'Robert Garcia',
    key_details: ['blood pressure medication', 'Perindopril 5mg', 'ran out 2 days ago', 'Chemist Warehouse Main St'],
    recommended_action: 'urgent_script_review',
    category: 'prescription',
    callback_number: '+61434567890',
    summary:
      'Regular patient out of BP medication (Perindopril 5mg) for 2 days. Needs urgent script to Chemist Warehouse Main St.'
  },
  {
    id: 'vm_010',
    timestamp: '2026-02-02T22:44:00Z',
    caller_name: 'Rachel Foster',
    duration: 41,
    transcript:
      "Hi, Rachel Foster calling. I need to cancel my appointment tomorrow at 2pm. Something's come up. Sorry for the late notice. You don't need to call me back, just please make sure it's cancelled. Thanks.",
    urgency: 'medium',
    patient_name: 'Rachel Foster',
    appointment_date: '2026-02-04T14:00:00Z',
    key_details: ['appointment tomorrow 2pm', 'wants cancellation', 'no callback needed'],
    recommended_action: 'cancel_and_confirm',
    category: 'appointment_cancellation',
    callback_number: '+61489012345',
    summary: 'Cancellation request for tomorrow 2pm appointment. No callback required - action and confirm only.'
  },
  {
    id: 'vm_004',
    timestamp: '2026-02-03T04:58:00Z',
    caller_name: 'David Kumar',
    duration: 62,
    transcript:
      "Hi there, David Kumar calling. I had some blood tests done last week and the doctor said someone would call with the results. I haven't heard anything yet and I'm getting a bit anxious about it. Can you please check on that and give me a call back? Thanks very much.",
    urgency: 'medium',
    patient_name: 'David Kumar',
    key_details: ['blood tests last week', 'waiting for results', 'no callback received'],
    recommended_action: 'check_records_then_callback',
    category: 'results_inquiry',
    callback_number: '+61423456789',
    summary: 'Waiting for blood test results from last week. Check pathology system before callback.'
  },
  {
    id: 'vm_008',
    timestamp: '2026-02-03T00:55:00Z',
    caller_name: 'Tom Anderson',
    duration: 73,
    transcript:
      "Yeah, hello. Tom Anderson. I saw Dr. Harrison last month about my knee pain and she referred me to a physio. I haven't received any referral letter or information about where to go. Can someone please look into this and let me know what happened with that referral? Cheers.",
    urgency: 'medium',
    patient_name: 'Tom Anderson',
    key_details: ['saw Dr Harrison last month', 'knee pain', 'physio referral', 'no letter received'],
    recommended_action: 'check_records_then_callback',
    category: 'referral',
    callback_number: '+61467890123',
    summary: 'Missing physio referral from Dr Harrison last month. Check if sent, resend or generate new referral.'
  },
  {
    id: 'vm_002',
    timestamp: '2026-02-03T06:15:00Z',
    caller_name: 'James Wong',
    duration: 45,
    transcript:
      "Yeah hi, it's James Wong. I had an appointment scheduled for Thursday this week but I need to reschedule because I have a work conflict. Can someone call me back to move it to next week? Cheers.",
    urgency: 'routine',
    patient_name: 'James Wong',
    appointment_date: '2026-02-06',
    key_details: ['appointment on Thursday', 'wants next week instead'],
    recommended_action: 'schedule_callback',
    category: 'appointment_change',
    callback_number: '+61498765432',
    summary: 'Reschedule request - move Thursday appointment to next week. Standard scheduling callback.'
  },
  {
    id: 'vm_009',
    timestamp: '2026-02-02T23:18:00Z',
    caller_name: 'Unknown',
    duration: 156,
    transcript:
      "Um, hi, I'm not sure if I have the right number. I'm trying to reach Harbour Medical Centre? Or maybe it's Sunset Clinic? Anyway, um, I'm new to the area and I need to find a GP. I moved here from Perth about two weeks ago and I have some ongoing health issues - I have diabetes and high cholesterol - and I need to continue my care. Do you take new patients? What's the process? Also I need to transfer my medical records. I'm not sure how that works. Can someone call me back and explain? Oh, and do you bulk bill? My number is 0478 901 234. Thanks.",
    urgency: 'routine',
    patient_name: 'Unknown caller',
    key_details: ['new to area', 'moved from Perth', 'has diabetes and cholesterol', 'needs records transfer'],
    recommended_action: 'new_patient_callback',
    category: 'new_patient',
    callback_number: '+61478901234',
    summary:
      'New patient inquiry - moved from Perth, has diabetes/cholesterol, needs enrolment info and records transfer.'
  },
  {
    id: 'vm_007',
    timestamp: '2026-02-03T01:22:00Z',
    caller_name: 'Michelle Nguyen',
    duration: 28,
    transcript:
      'Hi, Michelle Nguyen here. Can I please book an appointment for a general checkup sometime in the next couple of weeks? No particular urgency. Thanks.',
    urgency: 'routine',
    patient_name: 'Michelle Nguyen',
    key_details: ['general checkup', 'next 2 weeks', 'flexible timing'],
    recommended_action: 'schedule_callback',
    category: 'appointment_booking',
    callback_number: '+61445678901',
    summary: 'General checkup booking - flexible timing within 2 weeks. Standard scheduling.'
  },
  {
    id: 'vm_005',
    timestamp: '2026-02-03T03:12:00Z',
    caller_name: 'Lisa Thompson',
    duration: 34,
    transcript:
      "Hi, it's Lisa Thompson. I just need to update my address and phone number in your system. No rush, just when someone has a moment. Thanks!",
    urgency: 'low',
    patient_name: 'Lisa Thompson',
    key_details: ['address change', 'phone number change'],
    recommended_action: 'routine_callback',
    category: 'administrative',
    callback_number: '+61456789012',
    summary: 'Admin update - address and phone number change. Low priority, can batch with other admin tasks.'
  }
];

const VoicemailDashboard = () => {
  const [voicemails, setVoicemails] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const initialVoicemails = MOCK_VOICEMAILS.map((vm) => ({
      ...vm,
      status: 'new',
      assignedTo: null,
      notes: ''
    }));
    setVoicemails(initialVoicemails);
  }, []);

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          color: 'bg-red-100 border-red-500 text-red-900',
          badge: 'bg-red-600 text-white',
          icon: AlertCircle,
          label: 'CRITICAL'
        };
      case 'high':
        return {
          color: 'bg-orange-100 border-orange-500 text-orange-900',
          badge: 'bg-orange-600 text-white',
          icon: AlertCircle,
          label: 'HIGH'
        };
      case 'medium':
        return {
          color: 'bg-yellow-50 border-yellow-500 text-yellow-900',
          badge: 'bg-yellow-600 text-white',
          icon: Clock,
          label: 'MEDIUM'
        };
      case 'routine':
        return {
          color: 'bg-blue-50 border-blue-400 text-blue-900',
          badge: 'bg-blue-500 text-white',
          icon: Clock,
          label: 'ROUTINE'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-400 text-gray-900',
          badge: 'bg-gray-500 text-white',
          icon: Clock,
          label: 'LOW'
        };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medical_emergency':
        return AlertCircle;
      case 'sick_child':
        return AlertCircle;
      case 'prescription':
        return Pill;
      case 'appointment_change':
        return Calendar;
      case 'appointment_booking':
        return Calendar;
      case 'appointment_cancellation':
        return XCircle;
      case 'results_inquiry':
        return FileText;
      case 'referral':
        return FileText;
      case 'new_patient':
        return UserPlus;
      default:
        return FileText;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateStatus = (id, newStatus) => {
    setVoicemails(voicemails.map((vm) => (vm.id === id ? { ...vm, status: newStatus } : vm)));
  };

  const filteredVoicemails = voicemails.filter((vm) => {
    if (filterUrgency !== 'all' && vm.urgency !== filterUrgency) return false;
    if (filterStatus !== 'all' && vm.status !== filterStatus) return false;
    return true;
  });

  const sortedVoicemails = [...filteredVoicemails].sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, routine: 3, low: 4 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const stats = {
    total: voicemails.length,
    new: voicemails.filter((vm) => vm.status === 'new').length,
    critical: voicemails.filter((vm) => vm.urgency === 'critical').length,
    high: voicemails.filter((vm) => vm.urgency === 'high').length,
    inProgress: voicemails.filter((vm) => vm.status === 'in_progress').length,
    completed: voicemails.filter((vm) => vm.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voicemail Dashboard</h1>
          <p className="text-gray-600">Harbour to Sunset GP • Morning of Feb 3, 2026</p>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
            <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{stats.high}</div>
            <div className="text-sm text-orange-600">High</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 flex gap-4 items-center">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="routine">Routine</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-3">
          {sortedVoicemails.map((vm) => {
            const urgencyConfig = getUrgencyConfig(vm.urgency);
            const UrgencyIcon = urgencyConfig.icon;
            const CategoryIcon = getCategoryIcon(vm.category);
            const isExpanded = expandedId === vm.id;

            return (
              <div key={vm.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${urgencyConfig.color} transition-all`}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`${urgencyConfig.badge} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap`}
                    >
                      <UrgencyIcon className="w-3 h-3" />
                      {urgencyConfig.label}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">{vm.patient_name}</h3>
                          <span className="text-sm text-gray-500">• {vm.caller_name}</span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{formatTime(vm.timestamp)}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{vm.summary}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {vm.key_details.slice(0, 3).map((detail, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {detail}
                          </span>
                        ))}
                        {vm.key_details.length > 3 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{vm.key_details.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {vm.callback_number}
                        </div>
                        <div className="text-gray-500">•</div>
                        <div className="text-gray-600">
                          {Math.floor(vm.duration / 60)}:{(vm.duration % 60).toString().padStart(2, '0')} duration
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={vm.status}
                        onChange={(e) => updateStatus(vm.id, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : vm.id)}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">Full Transcript</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 max-h-32 overflow-y-auto">
                            {vm.transcript}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">Recommended Action</h4>
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-blue-900">
                              {vm.recommended_action.replace(/_/g, ' ').toUpperCase()}
                            </p>
                          </div>

                          <h4 className="font-semibold text-sm text-gray-900 mb-2">All Key Details</h4>
                          <div className="flex flex-wrap gap-2">
                            {vm.key_details.map((detail, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {detail}
                              </span>
                            ))}
                          </div>

                          <div className="mt-3">
                            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              Play original audio
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredVoicemails.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No voicemails match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicemailDashboard;
