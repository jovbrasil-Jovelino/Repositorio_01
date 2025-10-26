
import React, { useState, useEffect, useCallback } from 'react';
import { Equation, generateEquation } from './utils/equationGenerator';
import { generateExplanation } from './services/geminiService';
import { LightbulbIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, ChevronRightIcon } from './components/Icons';

type FeedbackStatus = 'correct' | 'incorrect' | 'unanswered';

const App: React.FC = () => {
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackStatus>('unanswered');
  const [explanation, setExplanation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const getNewEquation = useCallback(() => {
    setCurrentEquation(generateEquation());
    setUserAnswer('');
    setFeedback('unanswered');
    setExplanation('');
    setShowExplanation(false);
  }, []);

  useEffect(() => {
    getNewEquation();
  }, [getNewEquation]);

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer || !currentEquation) return;

    const answerAsNumber = parseFloat(userAnswer);
    if (answerAsNumber === currentEquation.solution) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleShowExplanation = async () => {
    if (!currentEquation) return;

    setShowExplanation(true);
    setIsAiLoading(true);
    try {
      const result = await generateExplanation(currentEquation.text);
      setExplanation(result);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation('Desculpe, não consegui gerar uma explicação no momento. Por favor, tente novamente.');
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const feedbackMessages = {
    correct: {
      text: "Correto! Você é incrível!",
      icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      textColor: 'text-green-800 dark:text-green-300'
    },
    incorrect: {
      text: "Não foi dessa vez. Tente novamente!",
      icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      textColor: 'text-red-800 dark:text-red-300'
    },
    unanswered: null
  };
  
  const currentFeedback = feedbackMessages[feedback];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-800 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Tutor de Equações
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Pratique e aprenda a resolver equações!</p>
        </header>

        <main className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm border border-white/20">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Resolva a equação:</p>
            <p className="text-5xl font-bold my-4 text-slate-900 dark:text-white tracking-wider bg-slate-100 dark:bg-slate-700/50 rounded-lg py-4">
              {currentEquation?.text || '...'}
            </p>
          </div>

          <form onSubmit={handleCheckAnswer} className="space-y-4">
            <input
              type="number"
              step="any"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Digite o valor de x"
              className="w-full px-4 py-3 text-lg text-center bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 outline-none"
              disabled={feedback === 'correct'}
            />
            {feedback !== 'correct' && (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-transform transform active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={!userAnswer}
              >
                Verificar Resposta
                <SparklesIcon className="w-5 h-5" />
              </button>
            )}
          </form>

          {currentFeedback && (
            <div className={`flex items-center gap-3 p-3 rounded-lg ${currentFeedback.bgColor} ${currentFeedback.textColor}`}>
              {currentFeedback.icon}
              <span className="font-medium">{currentFeedback.text}</span>
            </div>
          )}

          {feedback === 'correct' ? (
            <button
              onClick={getNewEquation}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-900 transition-transform transform active:scale-95"
            >
              Próxima Equação
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleShowExplanation}
              className="w-full flex items-center justify-center gap-2 bg-transparent text-slate-600 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <LightbulbIcon className="w-5 h-5 text-yellow-500" />
              Me mostre como resolver
            </button>
          )}

          {showExplanation && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 animate-fade-in">
              <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-200">Passo a passo:</h3>
              {isAiLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  <span className="text-slate-500 dark:text-slate-400">Gerando explicação...</span>
                </div>
              ) : (
                <div 
                  className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-2"
                  dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} 
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
