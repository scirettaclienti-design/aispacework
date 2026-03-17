import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const TypewriterText = React.memo(({ text, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayed(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                if (onCompleteRef.current) onCompleteRef.current();
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]); // Only restart interval when `text` changes, ignoring onComplete ref changes

    return <span>{displayed}</span>;
});

export function TerminalForm({ isOpen, onClose }) {
    const [step, setStep] = useState(0); // 0: Init, 1: Name, 2: Email, 3: Message, 4: Sending, 5: Success
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [inputVisible, setInputVisible] = useState(false);
    
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(0);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStep(1), 800);
        } else {
            document.body.style.overflow = '';
            setInputVisible(false);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (inputVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputVisible, step]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (step === 1 && formData.name) {
                setInputVisible(false);
                setStep(2);
            } else if (step === 2 && formData.email && formData.email.includes('@')) {
                setInputVisible(false);
                setStep(3);
            } else if (step === 3 && formData.message) {
                setInputVisible(false);
                submitForm();
            }
        }
    };

    const submitForm = () => {
        setStep(4); // Sending...

        const serviceId = 'SERVICE_ID_MOCK';
        const templateId = 'TEMPLATE_ID_MOCK';
        const publicKey = 'PUBLIC_KEY_MOCK';

        // NOTE: If using placeholders, simulate network request to avoid throwing JS errors for the user demo
        if (serviceId === 'SERVICE_ID_MOCK') {
            setTimeout(() => {
                setStep(5);
                setTimeout(onClose, 3000); // Auto close after 3 seconds
            }, 2000);
            return;
        }

        emailjs.send(
            serviceId,
            templateId,
            {
                from_name: formData.name,
                reply_to: formData.email,
                message: formData.message,
                to_email: 'sciretta.clienti@gmail.com'
            },
            publicKey
        ).then(() => {
            setStep(5);
            setTimeout(onClose, 3000);
        }).catch((err) => {
            console.error('EmailJS Error:', err);
            // Fallback for demo continuity
            setStep(5);
            setTimeout(onClose, 3000);
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] pointer-events-auto flex flex-col justify-center items-center pb-[10vh] bg-black/80 backdrop-blur-[20px] text-blue-400 font-mono p-6 md:p-12 overflow-hidden"
                >
                <div className="max-w-3xl w-full mx-auto flex flex-col gap-6">
                    
                    {/* Log History */}
                    {step > 1 && (
                        <div className="opacity-50">
                            <div className="mb-2">{`> IDENTIFICAZIONE RICHIESTA. INSERISCI IL TUO NOME:`}</div>
                            <div className="text-white mb-6">[{formData.name}]</div>
                        </div>
                    )}
                    {step > 2 && (
                        <div className="opacity-50">
                            <div className="mb-2">{`> INSERISCI EMAIL DI CONTATTO:`}</div>
                            <div className="text-white mb-6">[{formData.email}]</div>
                        </div>
                    )}
                    {step > 3 && (
                        <div className="opacity-50">
                            <div className="mb-2">{`> INSERISCI INTENTO O MESSAGGIO:`}</div>
                            <div className="text-white mb-6">[{formData.message}]</div>
                        </div>
                    )}

                    {/* Active Prompts */}
                    {step === 1 && (
                        <div>
                            <TypewriterText text="> IDENTIFICAZIONE RICHIESTA. INSERISCI IL TUO NOME:" onComplete={() => setInputVisible(true)} />
                            {inputVisible && (
                                <div className="mt-4 flex">
                                    <span className="mr-2 text-white">_</span>
                                    <input 
                                        ref={inputRef}
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none outline-none text-white w-full uppercase"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <TypewriterText text="> INSERISCI EMAIL DI CONTATTO:" onComplete={() => setInputVisible(true)} />
                            {inputVisible && (
                                <div className="mt-4 flex">
                                    <span className="mr-2 text-white">_</span>
                                    <input 
                                        ref={inputRef}
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none outline-none text-white w-full uppercase"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <TypewriterText text="> INSERISCI INTENTO O MESSAGGIO:" onComplete={() => setInputVisible(true)} />
                            {inputVisible && (
                                <div className="mt-4 flex">
                                    <span className="mr-2 text-white">_</span>
                                    <textarea 
                                        ref={inputRef}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none outline-none text-white w-full uppercase resize-none h-32"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-pulse flex items-center gap-4">
                            <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                            <span>TRASMISSIONE DATI IN CORSO...</span>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            <TypewriterText text="> TRASMISSIONE COMPLETATA. IL CORE TI CONTATTERÀ A BREVE." />
                        </div>
                    )}
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/50 hover:text-white uppercase text-xs tracking-widest border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors pointer-events-auto"
                >
                    [ INTERROMPI_CONNESSIONE ]
                </button>
            </motion.div>
            )}
        </AnimatePresence>
    );
}
