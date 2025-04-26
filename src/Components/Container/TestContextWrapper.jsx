import React, { createContext, useContext, useState, useEffect } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
    const [questionIds, setQuestionIds] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeLimit, setTimeLimit] = useState(0);
    const [timeUp, setTimeUp] = useState(false);

    useEffect(() => {
        let timerId;

        if (startTime && timeLimit > 0) {
            const endTime = startTime + timeLimit * 1000;
            const now = Date.now();
            const timeRemaining = endTime - now;

            if (timeRemaining > 0) {
                timerId = setTimeout(() => {
                    setTimeUp(true);
                }, timeRemaining);
            } else {
                setTimeUp(true);
            }
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [startTime, timeLimit]);

    useEffect(() => {
        if (questionIds.length > 0 && startTime === null) {
            setStartTime(Date.now());
            const initialAnswers = {};
            questionIds.forEach(id => {
                initialAnswers[id] = [];
            });
            setAnswers(initialAnswers);
        }
    }, [questionIds, startTime]);

    const nextQuestion = () => {
        setCurrentIndex(prev => Math.min(prev + 1, questionIds.length - 1));
    };

    const previousQuestion = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    }

    const resetTest = () => {
        setQuestionIds([]);
        setAnswers({});
        setCurrentIndex(0);
        setStartTime(null);
        setTimeLimit(0);
        setTimeUp(false);
    };

    const addAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: [...(prev[questionId] || []), answer]
        }));
    };

    const submitTest = () => {
        console.log('Submitting test...', { answers });
        resetTest();
    };

    const cancelSubmission = () => {
        console.log('User canceled submission.');
        // Maybe navigate back to review page or stay
        setTimeUp(false);
    };

    return (
        <TestContext.Provider
            value={{
                questionIds,
                answers,
                currentIndex,
                startTime,
                timeLimit,
                timeUp,
                setQuestionIds,
                nextQuestion,
                previousQuestion,
                resetTest,
                setTimeLimit,
                addAnswer,
                submitTest,
            }}
        >
            {children}

            {/* Global Time's Up Popup */}
            {timeUp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: 30, borderRadius: 8, textAlign: 'center'
                    }}>
                        <h2>Time's up!</h2>
                        <p>Do you want to submit your test?</p>
                        <div style={{ marginTop: 20 }}>
                            <button onClick={submitTest} style={{ marginRight: 10 }}>Submit</button>
                            <button onClick={cancelSubmission}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </TestContext.Provider>
    );
};

export const useTestContext = () => {
    const context = useContext(TestContext);
    if (!context) {
        throw new Error('useTestContext must be used within a TestProvider');
    }
    return context;
};
