
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

function WhatsAppIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871-.118.571-.355 1.758-2.18 2.006-2.664.248-.484.248-.898.173-1.045zM12.001 2.002C6.478 2.002 2 6.48 2 12.003c0 1.755.454 3.416 1.257 4.865L2 22l5.29-1.38c1.386.758 2.922 1.181 4.53 1.181h.001c5.522 0 9.998-4.478 9.998-9.998 0-5.522-4.477-9.999-9.998-9.999zM12 21.802c-1.63 0-3.175-.42-4.545-1.18l-.325-.195-3.375.885.899-3.297-.215-.34c-.813-1.428-1.263-3.04-1.263-4.735 0-4.965 4.032-8.998 8.998-8.998s8.998 4.033 8.998 8.998-4.032 8.998-8.998 8.998z"/>
        </svg>
    );
}

function WhatsAppChatbot() {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!currentUser) return null;

    const phoneNumber = "351968982354";
    const userName = currentUser.profile?.name || 'Cliente';
    const message = encodeURIComponent(`Olá, sou ${userName} e gostaria de falar com o suporte da FitBuilder Pro.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 transition-transform hover:scale-110 z-30"
                aria-label="Fale conosco pelo WhatsApp"
            >
                <WhatsAppIcon className="w-8 h-8"/>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4 animate-backdropIn" onClick={() => setIsOpen(false)}>
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-slide-in-up sm:animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-background">
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                        
                        <div className="text-center">
                            <div className="flex flex-col items-center mb-4">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                </div>
                                <h2 className="text-xl font-bold text-text-primary mt-3">Assistente FitBuilder Pro</h2>
                            </div>
                            
                            <p className="text-text-secondary mb-6 px-4">
                                Olá, <span className="font-bold text-text-primary">{userName}</span>! 👋 Como podemos ajudar você hoje?
                            </p>

                            <a 
                                href={whatsappUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                <WhatsAppIcon className="w-6 h-6"/>
                                <span className="ml-2">Conversar pelo WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WhatsAppChatbot;
