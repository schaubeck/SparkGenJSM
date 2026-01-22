
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { AppStatus, InspirationResult } from './types';
import { generateInspiration, generateVisual } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<InspirationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus(AppStatus.LOADING_TEXT);
    setError(null);
    
    try {
      const textData = await generateInspiration(topic);
      setResult(textData);
      
      setStatus(AppStatus.LOADING_IMAGE);
      const imageUrl = await generateVisual(textData.imagePrompt);
      
      setResult(prev => prev ? { ...prev, imageUrl } : null);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Algo salió mal. Por favor, inténtalo de nuevo.');
      setStatus(AppStatus.ERROR);
    }
  }, [topic]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Enciende tu <span className="text-indigo-500">Creatividad</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Introduce cualquier tema y deja que la IA genere una idea fresca junto con un concepto visual.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 mb-12">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ej., Arquitectura sostenible, Viajes espaciales, Arte minimalista..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
            disabled={status === AppStatus.LOADING_TEXT || status === AppStatus.LOADING_IMAGE}
          />
          <button
            type="submit"
            disabled={status === AppStatus.LOADING_TEXT || status === AppStatus.LOADING_IMAGE || !topic.trim()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {(status === AppStatus.LOADING_TEXT || status === AppStatus.LOADING_IMAGE) ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : "Encender"}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 mb-8">
            {error}
          </div>
        )}

        {(result || status !== AppStatus.IDLE) && (
          <div className={`transition-all duration-500 ${status === AppStatus.IDLE ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-slate-800 flex items-center justify-center">
                {status === AppStatus.LOADING_IMAGE ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 font-medium">Visualizando idea...</span>
                  </div>
                ) : result?.imageUrl ? (
                  <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-600 italic">Idea pendiente de visualización</div>
                )}
              </div>
              
              <div className="p-8">
                {status === AppStatus.LOADING_TEXT ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-slate-800 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
                  </div>
                ) : result && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-3">{result.title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{result.description}</p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-indigo-900/40 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">
                        Generado por Gemini
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
