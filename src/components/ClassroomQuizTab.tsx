import React, { useState, useEffect } from 'react';
import { Clock, Send, RotateCcw, Check } from 'lucide-react';
import { Quiz } from '../types';

interface ClassroomQuizTabProps {
  selectedClassId: string;
  quizTemplate: Quiz;
  onQuizSubmit: (classId: string, score: number, passed: boolean) => void;
}

export default function ClassroomQuizTab({ selectedClassId, quizTemplate, onQuizSubmit }: ClassroomQuizTabProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(2700); // 45 minutes in seconds

  useEffect(() => {
    if (quizSubmitted) return;
    const interval = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizSubmitted]);

  // Reset quiz state when active class changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizTimeLeft(2700);
  }, [selectedClassId]);

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizTemplate.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quizTemplate.questions.length) * 100);
    const finalPassed = finalScore >= quizTemplate.passingScore;

    setQuizResult({ score: finalScore, passed: finalPassed });
    setQuizSubmitted(true);
    onQuizSubmit(selectedClassId, finalScore, finalPassed);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Quiz Active Header with timer */}
        <div className="p-5 bg-[#0F1115] border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-left">
          <div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Ujian Akhir Kelulusan Resmi
            </span>
            <h3 className="font-display font-medium text-lg text-white mt-1">{quizTemplate.title}</h3>
            <p className="text-xs text-slate-500">Nilai Kelulusan Minimum: <strong className="text-slate-300">{quizTemplate.passingScore}</strong></p>
          </div>

          {/* Timer Display */}
          {!quizSubmitted && (
            <div className="flex items-center gap-2 bg-[#16181D] border border-white/10 px-4 py-2 rounded-xl text-xs font-mono select-none">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-slate-400">Sisa Waktu:</span>
              <span className={`font-bold ${quizTimeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                {(() => {
                  const mins = Math.floor(quizTimeLeft / 60).toString().padStart(2, '0');
                  const secs = (quizTimeLeft % 60).toString().padStart(2, '0');
                  return `${mins}:${secs}`;
                })()}
              </span>
            </div>
          )}
        </div>

        {/* Quiz result overview if submitted */}
        {quizSubmitted && quizResult && (
          <div className="p-6 text-center space-y-4 border-b border-white/10 bg-white/[0.01]">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center border text-2xl font-bold">
              {quizResult.passed ? (
                <div className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-full h-full rounded-full flex items-center justify-center">
                  ✓
                </div>
              ) : (
                <div className="bg-rose-500/10 text-rose-400 border-rose-500/20 w-full h-full rounded-full flex items-center justify-center font-mono">
                  ✗
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-black text-white">Nilai Anda: {quizResult.score}</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${
                quizResult.passed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {quizResult.passed ? 'LULUS (TERBITKAN SERTIFIKAT)' : 'BELUM LULUS'}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {quizResult.passed
                ? 'Selamat! Anda berhasil menempuh ujian evaluasi klinis kefarmasian dengan sangat baik. Sertifikat resmi Anda telah terbit otomatis di tab "Sertifikat Selesai".'
                : 'Nilai kelulusan minimum adalah 75. Silakan baca materi kembali dan tinjau ulasan pembahasan soal di bawah ini untuk mengulang kuis evaluasi.'}
            </p>

            {!quizResult.passed && (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuizResult(null);
                  setQuizTimeLeft(2700);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Ulangi Ujian</span>
              </button>
            )}
          </div>
        )}

        {/* Quiz Questions Body */}
        <div className="p-6 space-y-8 divide-y divide-white/5">
          {quizTemplate.questions.map((q, qIdx) => {
            const selectedAns = quizAnswers[q.id];
            const showRationale = quizSubmitted;

            return (
              <div key={q.id} className="pt-6 first:pt-0 space-y-4 text-left">
                <div className="flex gap-2">
                  <span className="font-mono text-xs text-slate-500 font-extrabold mt-0.5">SOAL {qIdx + 1}.</span>
                  <h4 className="text-sm font-bold text-slate-200 leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {/* Question Options */}
                <div className="grid grid-cols-1 gap-2 pl-6">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAns === optIdx;
                    const isCorrect = q.correctOption === optIdx;

                    let optStyle = 'border-white/10 text-slate-300 hover:bg-white/5';
                    if (isSelected) {
                      optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold';
                    }

                    if (showRationale) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-semibold';
                      } else if (isSelected) {
                        optStyle = 'border-rose-500 bg-rose-500/20 text-rose-400 font-semibold';
                      } else {
                        optStyle = 'border-white/5 text-slate-500 pointer-events-none';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() => {
                          setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                        }}
                        className={`p-3 border rounded-xl text-xs transition text-left flex items-center gap-3 cursor-pointer ${optStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] uppercase border ${
                          isSelected
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}>
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {showRationale && isCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Clinical Rationale (Pembahasan) */}
                {showRationale && (
                  <div className="pl-6 pt-2">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-1 select-text">
                      <strong className="text-slate-400 block font-bold">🩺 Pembahasan Studi Kasus:</strong>
                      <p className="text-slate-400 font-serif leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit footer bar */}
        {!quizSubmitted && (
          <div className="p-5 bg-[#0F1115] border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Terjawab: <strong className="text-slate-300 font-bold">{Object.keys(quizAnswers).length}</strong> dari <strong className="text-slate-300 font-bold">{quizTemplate.questions.length} Soal</strong>
            </span>

            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < quizTemplate.questions.length}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                Object.keys(quizAnswers).length === quizTemplate.questions.length
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer'
                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <span>Kirim Lembar Jawaban</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
