import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, Clock, BookOpen, PlusCircle, 
  Sparkles, CheckCircle2, AlertCircle, X, Search,
  Radio, Compass, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_SESSIONS = [
  {
    id: 1,
    course: 'ECE201: Signals & Systems',
    topic: 'Fourier Transforms & Convolution Integrals for Midterm',
    location: 'Central Library - 2nd Floor Group Pod B',
    host: 'Aishini K.',
    maxSeats: 5,
    joinedSeats: 3,
    remainingMinutes: 45,
    tag: 'Problem Solving',
    active: true
  },
  {
    id: 2,
    course: 'CSE302: Operating Systems',
    topic: 'Dining Philosophers & Semaphores Lab Debugging',
    location: 'CS Department - Block 2 Cafe Corner',
    host: 'Vivan G.',
    maxSeats: 4,
    joinedSeats: 2,
    remainingMinutes: 28,
    tag: 'Lab Prep',
    active: true
  },
  {
    id: 3,
    course: 'MATH204: Discrete Mathematics',
    topic: 'Hasse Diagrams & Equivalence Relations Quick Review',
    location: 'SAC Veranda - Table 4',
    host: 'Rohan M.',
    maxSeats: 6,
    joinedSeats: 5,
    remainingMinutes: 60,
    tag: 'Concept Review',
    active: true
  },
  {
    id: 4,
    course: 'MEC101: Engineering Graphics',
    topic: 'Isometric Projections & Sectional Views Practice',
    location: 'Polytechnic North Veranda Ground Tables',
    host: 'Sneha P.',
    maxSeats: 4,
    joinedSeats: 4,
    remainingMinutes: 15,
    tag: 'Assignment Rush',
    active: true
  }
];

export default function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('study_group_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const [userJoined, setUserJoined] = useState(() => {
    const saved = localStorage.getItem('user_joined_sessions');
    return saved ? JSON.parse(saved) : {};
  });

  // Modal State for Broadcasting a Session
  const [showModal, setShowModal] = useState(false);
  const [formCourse, setFormCourse] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSeats, setFormSeats] = useState(4);
  const [formMinutes, setFormMinutes] = useState(45);
  const [formTag, setFormTag] = useState('Problem Solving');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('study_group_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('user_joined_sessions', JSON.stringify(userJoined));
  }, [userJoined]);

  // Live Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSessions(prev => prev.map(s => ({
        ...s,
        remainingMinutes: Math.max(0, s.remainingMinutes - 1)
      })));
    }, 60000); // Ticks every minute
    return () => clearInterval(timer);
  }, []);

  const handleJoinSession = (id) => {
    setUserJoined(prev => ({ ...prev, [id]: true }));
    setSessions(prev => prev.map(s => {
      if (s.id === id && s.joinedSeats < s.maxSeats) {
        return { ...s, joinedSeats: s.joinedSeats + 1 };
      }
      return s;
    }));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleBroadcastSession = (e) => {
    e.preventDefault();
    if (!formCourse.trim() || !formTopic.trim() || !formLocation.trim()) return;

    const newSession = {
      id: Date.now(),
      course: formCourse,
      topic: formTopic,
      location: formLocation,
      host: 'You (Host)',
      maxSeats: parseInt(formSeats),
      joinedSeats: 1,
      remainingMinutes: parseInt(formMinutes),
      tag: formTag,
      active: true
    };

    setSessions([newSession, ...sessions]);
    setSelectedSession(newSession);
    setUserJoined(prev => ({ ...prev, [newSession.id]: true }));
    setShowModal(false);

    // Reset Form
    setFormCourse('');
    setFormTopic('');
    setFormLocation('');

    confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'All' || s.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>StudyGroupRadar</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Real-Time Campus Micro-Study & Cram Hub</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={15} /> Broadcast Study Beacon
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Left Column: Search, Category Filters, and Sessions */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search & Tag Filter Bar */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search course code, topic, or campus spot..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc', padding: '0 12px', fontSize: '13px' }}
            >
              <option value="All">All Focus Modes</option>
              <option value="Problem Solving">Problem Solving</option>
              <option value="Lab Prep">Lab Prep</option>
              <option value="Concept Review">Concept Review</option>
              <option value="Assignment Rush">Assignment Rush</option>
            </select>
          </div>

          {/* Sessions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredSessions.map(session => {
              const isSelected = selectedSession.id === session.id;
              const isFull = session.joinedSeats >= session.maxSeats;
              const isJoined = !!userJoined[session.id];

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  style={{
                    background: isSelected ? '#1e293b' : '#0f172a',
                    border: isSelected ? '1px solid #818cf8' : '1px solid #1e293b',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                        {session.course}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>
                        {session.tag}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: session.remainingMinutes <= 15 ? '#f87171' : '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={12} /> {session.remainingMinutes}m left
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '8px 0 4px 0', color: '#ffffff' }}>
                    {session.topic}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
                    <MapPin size={13} color="#f59e0b" /> {session.location}
                  </div>

                  {/* Seat Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      <span>Seats Filled</span>
                      <span>{session.joinedSeats} / {session.maxSeats} spots</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(session.joinedSeats / session.maxSeats) * 100}%`,
                        height: '100%',
                        background: isFull ? '#ef4444' : '#6366f1',
                        borderRadius: '999px'
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Detailed Session Inspector & RSVP */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '22px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Study Group Detail
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 10px 0' }}>{selectedSession.course}</h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 16px 0' }}>{selectedSession.topic}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#030712', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Host Student:</span>
                <strong style={{ color: '#f8fafc' }}>{selectedSession.host}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Location / Spot:</span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>{selectedSession.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Session Expiration:</span>
                <span style={{ color: '#34d399' }}>{selectedSession.remainingMinutes} Minutes Remaining</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Capacity Status:</span>
                <strong style={{ color: selectedSession.joinedSeats >= selectedSession.maxSeats ? '#ef4444' : '#60a5fa' }}>
                  {selectedSession.joinedSeats >= selectedSession.maxSeats ? 'Full Session' : `${selectedSession.maxSeats - selectedSession.joinedSeats} Seats Open`}
                </strong>
              </div>
            </div>

            {/* Action Button */}
            {userJoined[selectedSession.id] ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Seat Reserved! Head to {selectedSession.location}</span>
              </div>
            ) : (
              <button
                disabled={selectedSession.joinedSeats >= selectedSession.maxSeats}
                onClick={() => handleJoinSession(selectedSession.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: selectedSession.joinedSeats >= selectedSession.maxSeats ? '#334155' : '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: selectedSession.joinedSeats >= selectedSession.maxSeats ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Users size={16} /> {selectedSession.joinedSeats >= selectedSession.maxSeats ? 'Session Full' : 'Claim a Seat & Join Now'}
              </button>
            )}
          </div>

          {/* Quick Etiquette Guidelines */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 10px 0', color: '#cbd5e1' }}>Micro-Study Beacon Guidelines</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Beacons automatically expire when the countdown concludes.</li>
              <li>Limit sessions to 3–6 students to keep discussions productive.</li>
              <li>Respect the quiet rules of academic spaces (Library Stacks vs. Cafes).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Broadcast Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Broadcast Study Beacon</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowModal(false)} />
            </div>

            <form onSubmit={handleBroadcastSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Course Code & Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ECE201 or Discrete Math"
                  value={formCourse}
                  onChange={e => setFormCourse(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Study Focus / Problem</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 3 Debugging / Chapter 4 Problems"
                  value={formTopic}
                  onChange={e => setFormTopic(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Campus Spot & Table</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Library 2nd Floor Pod 3 or Block 2 Cafe"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Max Open Seats</label>
                  <select
                    value={formSeats}
                    onChange={e => setFormSeats(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value={3}>3 Students</option>
                    <option value={4}>4 Students</option>
                    <option value={5}>5 Students</option>
                    <option value={6}>6 Students</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Session Length</label>
                  <select
                    value={formMinutes}
                    onChange={e => setFormMinutes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Study Mode</label>
                <select
                  value={formTag}
                  onChange={e => setFormTag(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                >
                  <option value="Problem Solving">Problem Solving</option>
                  <option value="Lab Prep">Lab Prep</option>
                  <option value="Concept Review">Concept Review</option>
                  <option value="Assignment Rush">Assignment Rush</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  background: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Broadcast Beacon 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}