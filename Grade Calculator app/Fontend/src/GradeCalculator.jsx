import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function GradeCalculator() {
  const [formData, setFormData] = useState({
    student_name: '',
    course_name: '',
    assignment_score: '',
    midterm_score: '',
    final_score: ''
  });
  const [grades, setGrades] = useState([]);
  const [loadError, setLoadError] = useState(null);

  // This helper only fetches and returns data - it never calls setState
  // itself. Keeping it "pure" is what lets every call site decide when and
  // how to apply the result, and it's what satisfies the
  // react-hooks/set-state-in-effect lint rule below: the rule only
  // recognizes a setState call as safe when it's written directly inside an
  // inline async function, after an await - it can't see through a call to
  // a separately-defined function that does the setState internally.
  const loadGrades = useCallback(async (signal) => {
    const res = await fetch(`${API_BASE}/grades`, { signal });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    return res.json();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await loadGrades(controller.signal);
        setGrades(data);
        setLoadError(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Failed to fetch grades:", err);
        setLoadError("Couldn't reach the gradebook server. Is the backend running on port 8000?");
      }
    })();
    return () => controller.abort();
  }, [loadGrades]);

  const refreshGrades = async () => {
    try {
      const data = await loadGrades();
      setGrades(data);
      setLoadError(null);
    } catch (err) {
      console.error("Failed to fetch grades:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: formData.student_name,
          course_name: formData.course_name,
          assignment_score: parseFloat(formData.assignment_score),
          midterm_score: parseFloat(formData.midterm_score),
          final_score: parseFloat(formData.final_score)
        })
      });

      if (response.ok) {
        setFormData({
          student_name: '',
          course_name: '',
          assignment_score: '',
          midterm_score: '',
          final_score: ''
        });
        refreshGrades();
      } else {
        console.error("Server rejected the grade:", await response.text());
      }
    } catch (err) {
      console.error("Failed to save grade:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/grades/${id}`, { method: 'DELETE' });
      if (res.ok) refreshGrades();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE4] p-8 font-[Georgia,'Times_New_Roman',serif] text-[#1B2A41]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-[#1B2A41] pb-3">
          <h1 className="text-2xl tracking-wide">Gradebook</h1>
          <span className="text-xs uppercase tracking-[0.2em] text-[#6b6250]">Official Record</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM PANEL */}
          <div className="bg-[#FFFDF8] p-6 border border-[#1B2A41]/20 shadow-sm">
            <h2 className="text-lg mb-4 border-b border-[#C9A227] pb-2 inline-block">New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-[#1B2A41]/30 bg-transparent focus:ring-1 focus:ring-[#3D6B5C] focus:border-[#3D6B5C] outline-none text-sm"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-[#1B2A41]/30 bg-transparent focus:ring-1 focus:ring-[#3D6B5C] focus:border-[#3D6B5C] outline-none text-sm"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide mb-1">Assign. (40%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full px-3 py-2 border border-[#1B2A41]/30 bg-transparent focus:ring-1 focus:ring-[#3D6B5C] focus:border-[#3D6B5C] outline-none text-sm font-mono tabular-nums"
                    value={formData.assignment_score}
                    onChange={(e) => setFormData({ ...formData, assignment_score: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide mb-1">Midterm (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full px-3 py-2 border border-[#1B2A41]/30 bg-transparent focus:ring-1 focus:ring-[#3D6B5C] focus:border-[#3D6B5C] outline-none text-sm font-mono tabular-nums"
                    value={formData.midterm_score}
                    onChange={(e) => setFormData({ ...formData, midterm_score: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide mb-1">Final (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full px-3 py-2 border border-[#1B2A41]/30 bg-transparent focus:ring-1 focus:ring-[#3D6B5C] focus:border-[#3D6B5C] outline-none text-sm font-mono tabular-nums"
                    value={formData.final_score}
                    onChange={(e) => setFormData({ ...formData, final_score: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1B2A41] hover:bg-[#2a3d5c] text-[#F4EFE4] font-medium py-2 transition text-sm mt-2 tracking-wide"
              >
                Calculate &amp; Save
              </button>
            </form>
          </div>

          {/* DATA TABLE PANEL */}
          <div className="lg:col-span-2 bg-[#FFFDF8] p-6 border border-[#1B2A41]/20 shadow-sm">
            <h2 className="text-lg mb-4 border-b border-[#C9A227] pb-2 inline-block">Records</h2>

            {loadError && (
              <p className="text-sm text-[#B33A3A] font-sans mb-4">{loadError}</p>
            )}

            {!loadError && grades.length === 0 ? (
              <p className="text-[#6b6250] text-sm italic font-sans">No records stored yet.</p>
            ) : (
              <div className="overflow-x-auto font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1B2A41] text-[11px] font-semibold text-[#6b6250] uppercase tracking-wide">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Overall %</th>
                      <th className="pb-3">Grade</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2A41]/10 text-sm">
                    {grades.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F4EFE4]/60">
                        <td className="py-3 font-medium">{item.student_name}</td>
                        <td className="py-3 text-[#6b6250]">{item.course_name}</td>
                        <td className="py-3 font-mono tabular-nums">{item.final_percentage}%</td>
                        <td className="py-3">
                          <span className="inline-block px-2 py-1 border-2 border-[#B33A3A] text-[#B33A3A] font-bold text-xs -rotate-3">
                            {item.letter_grade}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[#B33A3A] hover:underline text-xs font-semibold uppercase tracking-wide"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}