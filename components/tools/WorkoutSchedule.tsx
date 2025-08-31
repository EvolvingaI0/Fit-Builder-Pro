
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

type NoteModalProps = {
    date: Date;
    note: string;
    onSave: (note: string) => void;
    onClose: () => void;
};

function NoteModal({ date, note, onSave, onClose }: NoteModalProps) {
    const [text, setText] = useState(note);

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-backdropIn p-4" onClick={onClose}>
            <Card className="w-full max-w-md animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-text-primary">Notas do Treino</h2>
                <p className="text-text-secondary mb-4">{date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Adicione suas anotações aqui (cargas, repetições, como se sentiu, etc.)"
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <Button onClick={onClose} variant="secondary">Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Notas</Button>
                </div>
            </Card>
        </div>
    );
};


function WorkoutSchedule() {
    const { currentUser, updateUser, isSaving } = useAuth();
    const user = currentUser;
    const plan = user?.fitnessPlan;
    const schedule = user?.workoutScheduleData || {};

    const [currentDate, setCurrentDate] = useState(new Date());
    const [noteModal, setNoteModal] = useState<{isOpen: boolean; date: Date | null}>({isOpen: false, date: null});

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const updateDayData = (date: Date, data: { status?: 'completed' | 'skipped', notes?: string }) => {
        if (!user) return;
        const dateString = date.toISOString().split('T')[0];
        const existingData = schedule[dateString] || {};
        const newSchedule = { ...schedule, [dateString]: { ...existingData, ...data }};
        updateUser({ ...user, workoutScheduleData: newSchedule });
    };
    
    const clearStatus = (date: Date) => {
        if (!user) return;
        const dateString = date.toISOString().split('T')[0];
        const newSchedule = { ...schedule };
        if (newSchedule[dateString]) {
             delete newSchedule[dateString].status;
             // If no notes either, remove the whole entry
             if (!newSchedule[dateString].notes) {
                delete newSchedule[dateString];
             }
        }
        updateUser({ ...user, workoutScheduleData: newSchedule });
    };

    const handleSaveNote = (note: string) => {
        if (noteModal.date) {
            updateDayData(noteModal.date, { notes: note });
        }
    };


    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    
    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="space-y-8">
             {noteModal.isOpen && noteModal.date && (
                <NoteModal 
                    date={noteModal.date}
                    note={schedule[noteModal.date.toISOString().split('T')[0]]?.notes || ''}
                    onSave={handleSaveNote}
                    onClose={() => setNoteModal({ isOpen: false, date: null })}
                />
            )}
            <h1 className="text-3xl font-bold text-text-primary">Agenda de Treinos</h1>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={() => changeMonth(-1)} variant="secondary" className="!p-2"><ChevronLeftIcon className="w-6 h-6"/></Button>
                    <h2 className="text-2xl font-bold text-text-primary">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h2>
                    <Button onClick={() => changeMonth(1)} variant="secondary" className="!p-2"><ChevronRightIcon className="w-6 h-6"/></Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-text-secondary text-sm">
                    {weekDays.map(wd => <div key={wd} className="p-2">{wd}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map(d => {
                        const dateString = d.toISOString().split('T')[0];
                        const isToday = new Date().toISOString().split('T')[0] === dateString;
                        const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                        const workoutForDay = (!plan || !plan.workouts || plan.workouts.length === 0) ? null : plan.workouts.find(w => ((d.getDay() || 7) - 1) % plan.workouts.length === w.day - 1);
                        const dayData = schedule[dateString];
                        const dayStatus = dayData?.status;
                        const hasNote = dayData?.notes && dayData.notes.trim() !== '';

                        return (
                            <div key={dateString} className={`p-2 h-36 rounded-lg border flex flex-col relative ${isCurrentMonth ? 'bg-surface' : 'bg-background text-text-secondary/50'} ${isToday ? 'border-primary' : 'border-border'}`}>
                                <span className={`font-bold ${isToday ? 'text-primary' : ''}`}>{d.getDate()}</span>
                                 {isCurrentMonth && hasNote && <DocumentTextIcon className="w-4 h-4 text-amber-500 absolute top-2 right-2"/>}

                                {workoutForDay && isCurrentMonth && (
                                    <div className="mt-1 text-xs text-left flex-grow">
                                        <p className="font-semibold text-primary truncate">{workoutForDay.focus}</p>
                                        {!dayStatus && (
                                             <div className="flex items-center space-x-1 mt-2">
                                                <button onClick={() => updateDayData(d, {status: 'completed'})} className="text-green-400 hover:text-green-600"><CheckCircleIcon className="w-5 h-5"/></button>
                                                <button onClick={() => updateDayData(d, {status: 'skipped'})} className="text-red-400 hover:text-red-600"><XCircleIcon className="w-5 h-5"/></button>
                                                <button onClick={() => setNoteModal({isOpen: true, date: d})} className="text-gray-400 hover:text-gray-600"><PencilIcon className="w-5 h-5"/></button>
                                             </div>
                                        )}
                                    </div>
                                )}
                                {dayStatus && (
                                     <div className="mt-1 text-xs text-left flex-grow flex flex-col justify-center items-center cursor-pointer" onClick={() => clearStatus(d)}>
                                        {dayStatus === 'completed' && <CheckCircleIcon className="w-8 h-8 text-green-500"/>}
                                        {dayStatus === 'skipped' && <XCircleIcon className="w-8 h-8 text-red-500"/>}
                                        <span className={`mt-1 font-bold ${dayStatus === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{dayStatus === 'completed' ? 'Concluído' : 'Pulado'}</span>
                                     </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                 {isSaving && <p className="text-sm text-center mt-4 text-text-secondary animate-pulse">Salvando agenda...</p>}
            </Card>
        </div>
    );
};

export default WorkoutSchedule;
